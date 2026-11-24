// Genera un id único para cada registro
export const uid = () =>
  globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
