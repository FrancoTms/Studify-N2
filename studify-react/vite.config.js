import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// En producción, Vercel ejecuta las funciones de la carpeta /api.
// En desarrollo (npm run dev), este plugin hace lo mismo para /api/chat, así no hace falta "vercel dev".
function localApi(env) {
  return {
    name: 'studify-local-api',
    configureServer(server) {
      // Las variables sin el prefijo VITE_ (como ANTHROPIC_API_KEY) solo las ve el servidor
      Object.assign(process.env, env)

      server.middlewares.use('/api/chat', async (req, res) => {
        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw
        try {
          // Se importa en cada petición para tomar los cambios del archivo sin reiniciar
          const { default: handler } = await server.ssrLoadModule('/api/chat.js')
          await handler(req, res)
        } catch (error) {
          console.error(error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Error en la función local /api/chat.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localApi(env)],
  }
})
