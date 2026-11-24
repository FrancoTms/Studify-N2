export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  if (!email.trim()) return 'Ingresá tu correo electrónico.'
  if (!EMAIL_REGEX.test(email.trim())) return 'Revisá el formato, por ejemplo nombre@mail.com.'
  return undefined
}

export function validatePassword(password) {
  if (!password) return 'Ingresá tu contraseña.'
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return undefined
}

// Quita las claves sin error para saber si el formulario es válido
export const cleanErrors = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
