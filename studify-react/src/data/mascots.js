// Las imágenes están en public/img, así que se usan por ruta (sin import).
// La clave es el "id" de la sección en el Dashboard. Para sumar otra imagen, agregá una línea.
const img = (name) => `${import.meta.env.BASE_URL}img/${name}`

export const mascots = {
  'mis-apuntes': img('mascota-apuntes.png'),
  'estadisticas': img('mascota-estadisticas.png'),
  'pomodoro': img('mascota-foco.png'),
  'tecnicas-estudio': img('mascota-tecnicas.png'),
  'ia-asistente': img('mascota-ia.png'),
  'calendario': img('mascota-calendario.png'),
  'mi-progreso': img('mascota-config.png'),
  'plan-de-hoy': img('mascota-plan.png'),
  'proximos-examenes': img('mascota-examenes.png'),
  'materias': img('mascota-apuntes.png'),
  'wikipedia': img('mascota-ia.png'),
}
