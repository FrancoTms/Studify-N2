// Función serverless de Vercel: recibe la conversación del chat y se la manda a un modelo de IA.
// Las claves viven solo en el servidor (variables de entorno), nunca en el navegador.
//
// Proveedor según AI_PROVIDER:
//   gemini    (por defecto, nivel gratuito) → GEMINI_API_KEY    · modelo GEMINI_MODEL
//   groq      (nivel gratuito)              → GROQ_API_KEY      · modelo GROQ_MODEL
//   anthropic (Claude, pago por uso)        → ANTHROPIC_API_KEY · modelo ANTHROPIC_MODEL

const MAX_OUTPUT_TOKENS = 1024
const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000
const MAX_CONTEXT_LENGTH = 8000

const SYSTEM_PROMPT = `Sos el asistente de estudio de Studify, una app para estudiantes universitarios de Argentina.
Hablás en español rioplatense (voseo), con un tono cercano, claro y motivador.

Tu trabajo:
- Ayudar a organizar el estudio: planificar el día o la semana, priorizar tareas y preparar exámenes.
- Explicar temas de las materias del estudiante con ejemplos simples.
- Recomendar técnicas de estudio (Pomodoro, Active Recall, repaso espaciado, mapas mentales, técnica Feynman).
- Usar los datos del estudiante que vienen en <datos_del_estudiante> cuando la pregunta tenga que ver con sus tareas, materias, exámenes, apuntes o progreso. No inventes datos que no estén ahí; si falta algo, decilo y sugerí cargarlo en Studify.

Formato:
- Respuestas cortas (hasta 150 palabras salvo que pidan más detalle).
- Texto plano, sin Markdown: nada de asteriscos, numerales ni tablas. Para listas usá guiones simples al inicio de la línea.

Si te piden algo que no tiene que ver con el estudio, respondé brevemente y volvé a ofrecer ayuda con el estudio.`

// Límite simple por IP para que nadie gaste los créditos llamando la función sin parar.
// Es "en memoria": se reinicia cuando Vercel recicla la función, así que es solo una protección básica.
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 10
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_REQUESTS_PER_WINDOW
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

// Deja solo mensajes válidos, alternando usuario/asistente y empezando por el usuario
function cleanMessages(raw) {
  if (!Array.isArray(raw)) return []
  const valid = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH) }))

  const result = []
  for (const m of valid) {
    if (!result.length && m.role !== 'user') continue
    const last = result[result.length - 1]
    if (last && last.role === m.role) last.content += `\n${m.content}`
    else result.push({ ...m })
  }
  return result
}

class ProviderError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Traduce los errores HTTP de cualquier proveedor a mensajes para el usuario
function providerError(status, detail, name) {
  console.error(`Error de ${name}:`, status, detail)
  if (status === 400 && /api key|api_key/i.test(String(detail))) return new ProviderError(500, `La clave de ${name} no es válida.`)
  if (status === 401 || status === 403) return new ProviderError(500, `La clave de ${name} no es válida o no tiene permiso.`)
  if (status === 404) return new ProviderError(500, `El modelo configurado no existe en ${name}. Revisá la variable del modelo.`)
  if (status === 429) return new ProviderError(429, 'Se alcanzó el límite gratuito de la IA. Probá de nuevo en un rato.')
  if (status >= 500) return new ProviderError(503, 'La IA está con mucha demanda en este momento. Probá de nuevo en unos segundos.')
  return new ProviderError(502, 'No pudimos obtener una respuesta del asistente.')
}

const PROVIDERS = {
  gemini: {
    name: 'Gemini',
    keyVar: 'GEMINI_API_KEY',
    model: () => process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    async ask({ apiKey, model, system, messages }) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          // Gemini llama "model" al rol del asistente
          contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.7 },
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Gemini')
      const candidate = data?.candidates?.[0]
      if (candidate?.finishReason === 'SAFETY') return 'Prefiero no responder eso. ¿Te ayudo con algo de tu estudio?'
      return (candidate?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim()
    },
  },

  groq: {
    name: 'Groq',
    keyVar: 'GROQ_API_KEY',
    model: () => process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    async ask({ apiKey, model, system, messages }) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: MAX_OUTPUT_TOKENS,
          messages: [{ role: 'system', content: system }, ...messages],
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Groq')
      return (data?.choices?.[0]?.message?.content ?? '').trim()
    },
  },

  anthropic: {
    name: 'Claude',
    keyVar: 'ANTHROPIC_API_KEY',
    model: () => process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
    async ask({ apiKey, model, system, messages }) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, system, messages }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Claude')
      return (data?.content ?? [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido.' })

  const providerKey = (process.env.AI_PROVIDER || 'gemini').toLowerCase()
  const provider = PROVIDERS[providerKey]
  if (!provider) return send(res, 500, { error: `AI_PROVIDER="${providerKey}" no es válido. Usá gemini, groq o anthropic.` })

  const apiKey = process.env[provider.keyVar]
  if (!apiKey) return send(res, 500, { error: `El servidor no tiene configurada la clave ${provider.keyVar}.` })

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'local').split(',')[0].trim()
  if (rateLimited(ip)) return send(res, 429, { error: 'Muchas preguntas seguidas. Esperá un minuto y probá de nuevo.' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return send(res, 400, { error: 'El cuerpo de la petición no es JSON válido.' })
    }
  }

  const messages = cleanMessages(body?.messages)
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return send(res, 400, { error: 'Falta la pregunta del usuario.' })
  }

  const context = typeof body?.context === 'string' ? body.context.slice(0, MAX_CONTEXT_LENGTH) : ''
  const system = context
    ? `${SYSTEM_PROMPT}\n\n<datos_del_estudiante>\n${context}\n</datos_del_estudiante>`
    : SYSTEM_PROMPT

  try {
    const reply = await provider.ask({ apiKey, model: provider.model(), system, messages })
    return send(res, 200, { reply: reply || 'No tengo una respuesta para eso. ¿Podés reformular la pregunta?' })
  } catch (error) {
    if (error instanceof ProviderError) return send(res, error.status, { error: error.message })
    console.error('Error al llamar a la IA:', error)
    return send(res, 502, { error: 'No pudimos conectarnos con el asistente.' })
  }
}
