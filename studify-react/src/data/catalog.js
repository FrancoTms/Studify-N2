// Opciones que se usan en los formularios

export const TONES = [
  { value: 'primary', label: 'Celeste' },
  { value: 'success', label: 'Verde' },
  { value: 'warning', label: 'Amarillo' },
  { value: 'danger', label: 'Rojo' },
  { value: 'info', label: 'Azul' },
]

export const SUBJECT_ICONS = [
  { value: 'bi-book', label: 'Libro' },
  { value: 'bi-code-slash', label: 'Código' },
  { value: 'bi-diagram-3', label: 'Diagrama' },
  { value: 'bi-bar-chart', label: 'Gráfico' },
  { value: 'bi-calculator', label: 'Calculadora' },
  { value: 'bi-database', label: 'Base de datos' },
  { value: 'bi-cpu', label: 'Hardware' },
  { value: 'bi-globe2', label: 'Mundo' },
  { value: 'bi-translate', label: 'Idiomas' },
  { value: 'bi-people', label: 'Personas' },
  { value: 'bi-briefcase', label: 'Trabajo' },
  { value: 'bi-shield-check', label: 'Seguridad' },
]

export const PRIORITIES = [
  { value: 'Alta', tone: 'danger' },
  { value: 'Normal', tone: 'primary' },
  { value: 'Baja', tone: 'secondary' },
]

export const PRIORITY_ORDER = { Alta: 0, Normal: 1, Baja: 2 }

// Modos del Pomodoro. "setting" es el campo de Configuración con los minutos de cada modo.
export const POMODORO_MODES = {
  focus: { label: 'Enfoque', tab: 'Enfoque', setting: 'focusMinutes', tone: 'primary' },
  short: { label: 'Descanso corto', tab: 'Corto', setting: 'shortBreakMinutes', tone: 'success' },
  long: { label: 'Descanso largo', tab: 'Largo', setting: 'longBreakMinutes', tone: 'info' },
}

