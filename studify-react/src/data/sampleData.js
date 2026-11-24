import { addDays, startOfDay, toISODate } from '../utils/dates'

export const DEFAULT_SETTINGS = {
  weeklyGoalHours: 12,
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
}

export const emptyData = () => ({
  subjects: [],
  tasks: [],
  notes: [],
  events: [],
  sessions: [],
  units: [],
  topics: [],
  files: [],
  settings: { ...DEFAULT_SETTINGS },
})

// Datos de ejemplo para el modo invitado o para probar la app. Las fechas se calculan desde hoy.
export function createSampleData(settings = DEFAULT_SETTINGS) {
  const today = startOfDay(new Date())
  const day = (offset) => toISODate(addDays(today, offset))
  const at = (offset, hour) => {
    const d = addDays(today, offset)
    d.setHours(hour, 0, 0, 0)
    return d.toISOString()
  }

  const PROG = 'sample-prog'
  const ANAL = 'sample-anal'
  const GEST = 'sample-gest'

  return {
    settings: { ...settings },
    subjects: [
      { id: PROG, name: 'Programación', teacher: 'Desarrollo de software', icon: 'bi-code-slash', tone: 'primary', createdAt: at(-30, 9) },
      { id: ANAL, name: 'Análisis de Sistemas', teacher: 'Sistemas de información', icon: 'bi-diagram-3', tone: 'success', createdAt: at(-30, 9) },
      { id: GEST, name: 'Gestión de Desarrollo', teacher: 'Gestión de proyectos', icon: 'bi-bar-chart', tone: 'warning', createdAt: at(-30, 9) },
    ],
    tasks: [
      { id: 'sample-t1', title: 'Repasar teoría para el parcial', subjectId: GEST, priority: 'Alta', dueDate: day(0), completed: false, createdAt: at(-2, 10) },
      { id: 'sample-t2', title: 'Terminar componentes de Studify', subjectId: PROG, priority: 'Alta', dueDate: day(0), completed: false, createdAt: at(-3, 10) },
      { id: 'sample-t3', title: 'Ordenar apuntes de Unidad 3', subjectId: ANAL, priority: 'Normal', dueDate: day(0), completed: true, completedAt: at(0, 8), createdAt: at(-1, 10) },
      { id: 'sample-t4', title: 'Leer capítulo de requerimientos', subjectId: ANAL, priority: 'Normal', dueDate: day(2), completed: false, createdAt: at(-1, 11) },
      { id: 'sample-t5', title: 'Practicar hooks de React', subjectId: PROG, priority: 'Normal', dueDate: day(-3), completed: true, completedAt: at(-3, 18), createdAt: at(-6, 10) },
      { id: 'sample-t6', title: 'Hacer ejercicios de estimación', subjectId: GEST, priority: 'Baja', dueDate: day(4), completed: false, createdAt: at(-1, 12) },
      { id: 'sample-t7', title: 'Subir TP al repositorio', subjectId: PROG, priority: 'Alta', dueDate: day(-1), completed: true, completedAt: at(-1, 20), createdAt: at(-4, 10) },
    ],
    notes: [
      {
        id: 'sample-n1',
        title: 'React y componentes',
        subjectId: PROG,
        content: 'Un componente es una función que devuelve JSX.\n\n- Las props pasan datos de padre a hijo.\n- useState guarda el estado del componente.\n- useEffect ejecuta efectos (peticiones, timers) después de renderizar.',
        createdAt: at(-5, 10),
        updatedAt: at(0, 9),
      },
      {
        id: 'sample-n2',
        title: 'Estimación de proyectos',
        subjectId: GEST,
        content: 'Técnicas: juicio de expertos, analogía, puntos de función y Planning Poker.\nLa estimación mejora con datos históricos del equipo.',
        createdAt: at(-6, 10),
        updatedAt: at(-1, 17),
      },
      {
        id: 'sample-n3',
        title: 'Análisis de requerimientos',
        subjectId: ANAL,
        content: 'Requerimientos funcionales: lo que el sistema debe hacer.\nNo funcionales: cómo debe hacerlo (rendimiento, seguridad, usabilidad).',
        createdAt: at(-8, 10),
        updatedAt: at(-3, 15),
      },
    ],
    events: [
      { id: 'sample-e1', title: 'Repasar teoría para el parcial', subjectId: GEST, type: 'study', date: day(0), time: '18:00' },
      { id: 'sample-e2', title: 'Parcial Unidad 1–4', subjectId: GEST, type: 'exam', date: day(1), time: '09:00' },
      { id: 'sample-e3', title: 'Repasar Unidad 3', subjectId: ANAL, type: 'study', date: day(2), time: '' },
      { id: 'sample-e4', title: 'Presentación Repositorio N.º 2', subjectId: PROG, type: 'exam', date: day(3), time: '14:00' },
      { id: 'sample-e5', title: 'Trabajo Práctico N.º 2', subjectId: PROG, type: 'task', date: day(5), time: '23:59' },
      { id: 'sample-e6', title: 'Evaluación práctica', subjectId: ANAL, type: 'exam', date: day(9), time: '10:00' },
    ],
    // Unidades y temas de ejemplo (los archivos se suben desde la página de cada materia)
    units: [
      { id: 'sample-u1', subjectId: PROG, name: 'Unidad 1: Fundamentos de React', order: 0, createdAt: at(-20, 9) },
      { id: 'sample-u2', subjectId: PROG, name: 'Unidad 2: Hooks y estado', order: 1, createdAt: at(-20, 9) },
      { id: 'sample-u3', subjectId: ANAL, name: 'Unidad 1: Requerimientos', order: 0, createdAt: at(-20, 9) },
      { id: 'sample-u4', subjectId: GEST, name: 'Unidad 1: Estimación', order: 0, createdAt: at(-20, 9) },
    ],
    topics: [
      { id: 'sample-tp1', unitId: 'sample-u1', name: 'Componentes y props', createdAt: at(-20, 9) },
      { id: 'sample-tp2', unitId: 'sample-u1', name: 'JSX', createdAt: at(-20, 9) },
      { id: 'sample-tp3', unitId: 'sample-u2', name: 'useState y useEffect', createdAt: at(-20, 9) },
      { id: 'sample-tp4', unitId: 'sample-u3', name: 'Funcionales y no funcionales', createdAt: at(-20, 9) },
    ],
    files: [],
    // Sesiones de Pomodoro de los últimos días para que las estadísticas tengan datos
    sessions: [
      [-6, 9, PROG], [-6, 10, PROG], [-5, 18, ANAL], [-4, 9, GEST], [-4, 10, GEST], [-4, 11, PROG],
      [-3, 17, PROG], [-3, 18, ANAL], [-2, 9, GEST], [-1, 19, PROG], [-1, 20, ANAL], [0, 8, GEST],
    ].map(([offset, hour, subjectId], i) => ({
      id: `sample-s${i + 1}`,
      date: at(offset, hour),
      minutes: 25,
      subjectId,
    })),
  }
}
