// Función serverless de Vercel: recibe la conversación del chat y se la manda a un modelo de IA.
// Las claves viven solo en el servidor (variables de entorno), nunca en el navegador.
//
// Proveedor según AI_PROVIDER:
//   gemini    (por defecto, nivel gratuito) → GEMINI_API_KEY    · modelos GEMINI_MODEL
//   groq      (nivel gratuito)              → GROQ_API_KEY      · modelos GROQ_MODEL
//   anthropic (Claude, pago por uso)        → ANTHROPIC_API_KEY · modelos ANTHROPIC_MODEL
//
// Las variables de modelo aceptan varios nombres separados por coma, en orden de preferencia.
// Si un modelo está saturado (503), sin cupo (429) o ya no existe (404), se prueba el siguiente.
// Si todos fallan, se usa como respaldo cualquier otro proveedor que tenga su clave configurada.

const MAX_OUTPUT_TOKENS = 1024
const ATTEMPT_TIMEOUT_MS = 9000 // tiempo máximo por intento
const RETRY_DELAY_MS = 800
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

// retryable = vale la pena probar con otro modelo o proveedor
class ProviderError extends Error {
  constructor(status, message, retryable = false) {
    super(message)
    this.status = status
    this.retryable = retryable
  }
}

// Traduce los errores HTTP de cualquier proveedor a mensajes para el usuario
function providerError(status, detail, name, model) {
  console.error(`Error de ${name} (${model}):`, status, detail)
  if (status === 400 && /api key|api_key/i.test(String(detail))) return new ProviderError(500, `La clave de ${name} no es válida.`)
  if (status === 401 || status === 403) return new ProviderError(500, `La clave de ${name} no es válida o no tiene permiso.`)
  if (status === 404) return new ProviderError(500, `El modelo ${model} no existe en ${name}. Revisá la variable del modelo.`, true)
  if (status === 429) return new ProviderError(429, 'Se alcanzó el límite gratuito de la IA. Probá de nuevo en un rato.', true)
  if (status >= 500) return new ProviderError(503, 'La IA está con mucha demanda en este momento. Probá de nuevo en unos segundos.', true)
  return new ProviderError(502, 'No pudimos obtener una respuesta del asistente.')
}

// fetch con tiempo máximo: si el modelo no contesta a tiempo, se pasa al siguiente
async function fetchWithTimeout(url, options, name, model) {
  try {
    return await fetch(url, { ...options, signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) })
  } catch (error) {
    console.error(`Sin respuesta de ${name} (${model}):`, error?.name ?? error)
    throw new ProviderError(503, 'La IA tardó demasiado en responder. Probá de nuevo.', true)
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const modelList = (value, fallback) =>
  (value || fallback)
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)

const PROVIDERS = {
  gemini: {
    name: 'Gemini',
    keyVar: 'GEMINI_API_KEY',
    // Primero los modelos más livianos y menos saturados del nivel gratuito
    models: () => modelList(process.env.GEMINI_MODEL, 'gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-3.8-flash'),
    async ask({ apiKey, model, system, messages }) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          // Gemini llama "model" al rol del asistente
          contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.7 },
        }),
      }, 'Gemini', model)
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Gemini', model)
      const candidate = data?.candidates?.[0]
      if (candidate?.finishReason === 'SAFETY') return 'Prefiero no responder eso. ¿Te ayudo con algo de tu estudio?'
      return (candidate?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim()
    },
  },

  groq: {
    name: 'Groq',
    keyVar: 'GROQ_API_KEY',
    models: () => modelList(process.env.GROQ_MODEL, 'openai/gpt-oss-120b,llama-3.3-70b-versatile'),
    async ask({ apiKey, model, system, messages }) {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: MAX_OUTPUT_TOKENS,
          messages: [{ role: 'system', content: system }, ...messages],
        }),
      }, 'Groq', model)
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Groq', model)
      return (data?.choices?.[0]?.message?.content ?? '').trim()
    },
  },

  anthropic: {
    name: 'Claude',
    keyVar: 'ANTHROPIC_API_KEY',
    models: () => modelList(process.env.ANTHROPIC_MODEL, 'claude-haiku-5-5'),
    async ask({ apiKey, model, system, messages }) {
      const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, system, messages }),
      }, 'Claude', model)
      const data = await response.json().catch(() => null)
      if (!response.ok) throw providerError(response.status, data?.error?.message, 'Claude', model)
      return (data?.content ?? [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()
    },
  },
}

// Prueba cada modelo de cada proveedor en orden hasta obtener una respuesta.
// El primer modelo saturado se reintenta una vez tras una pausa corta.
async function askWithFallback(chain, request) {
  let lastError = null
  for (const { provider, apiKey } of chain) {
    for (const [index, model] of provider.models().entries()) {
      const attempts = index === 0 ? 2 : 1
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          const reply = await provider.ask({ apiKey, model, ...request })
          if (lastError) console.info(`Respondió ${provider.name} (${model}) después de errores anteriores.`)
          return reply
        } catch (error) {
          if (!(error instanceof ProviderError) || !error.retryable) throw error
          lastError = error
          // Solo vale la pena reintentar el mismo modelo si estaba saturado
          if (attempt < attempts && error.status === 503) await wait(RETRY_DELAY_MS)
          else break
        }
      }
    }
  }
  throw lastError ?? new ProviderError(502, 'No pudimos obtener una respuesta del asistente.')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido.' })

  const providerKey = (process.env.AI_PROVIDER || 'gemini').toLowerCase()
  const provider = PROVIDERS[providerKey]
  if (!provider) return send(res, 500, { error: `AI_PROVIDER="${providerKey}" no es válido. Usá gemini, groq o anthropic.` })

  const apiKey = process.env[provider.keyVar]
  if (!apiKey) return send(res, 500, { error: `El servidor no tiene configurada la clave ${provider.keyVar}.` })

  // Proveedor elegido primero; después, de respaldo, los demás que tengan clave
  const chain = [
    { provider, apiKey },
    ...Object.entries(PROVIDERS)
      .filter(([key, p]) => key !== providerKey && process.env[p.keyVar])
      .map(([, p]) => ({ provider: p, apiKey: process.env[p.keyVar] })),
  ]

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
    const reply = await askWithFallback(chain, { system, messages })
    return send(res, 200, { reply: reply || 'No tengo una respuesta para eso. ¿Podés reformular la pregunta?' })
  } catch (error) {
    if (error instanceof ProviderError) return send(res, error.status, { error: error.message })
    console.error('Error al llamar a la IA:', error)
    return send(res, 502, { error: 'No pudimos conectarnos con el asistente.' })
  }
}