// Ítems del menú lateral y del menú móvil. "to" es la ruta de React Router.
export const navItems = [
  { icon: 'bi-house-door-fill', label: 'Inicio', to: '/' },
  { icon: 'bi-check2-square', label: 'Plan de hoy', to: '/tareas' },
  { icon: 'bi-book-fill', label: 'Mis Materias', to: '/materias' },
  { icon: 'bi-journal-text', label: 'Mis Apuntes', to: '/apuntes' },
  { icon: 'bi-calendar2-week', label: 'Próximos Exámenes', to: '/examenes' },
  { icon: 'bi-calendar3', label: 'Calendario', to: '/calendario' },
  { icon: 'bi-alarm-fill', label: 'Pomodoro', to: '/pomodoro' },
  { icon: 'bi-bar-chart-fill', label: 'Estadísticas', to: '/estadisticas' },
  { icon: 'bi-lightbulb-fill', label: 'Técnicas de Estudio', to: '/tecnicas' },
  { icon: 'bi-robot', label: 'IA Asistente', to: '/asistente' },
  { icon: 'bi-search', label: 'Buscar en Wikipedia', to: '/wikipedia' },
  { icon: 'bi-gear-fill', label: 'Configuración', to: '/configuracion' },
]

export const isActivePath = (pathname, to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))
