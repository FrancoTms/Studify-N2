# Studify

Studify es una aplicación web para estudiantes que reúne en un solo lugar la organización del estudio: tareas del día, materias, apuntes, exámenes, calendario, progreso, técnicas de estudio, Pomodoro y búsqueda de información en Wikipedia.

Este repositorio (**Repositorio Nº 2**) es la migración del proyecto original en HTML, CSS y JavaScript a **React + Vite**, desarrollada para los Trabajos Prácticos Nº 5 al Nº 8.

- **Demo en línea:** `https://studify-n2.vercel.app/`

## Funcionalidades

- **Inicio de sesión** con validación de correo y contraseña, mensajes de error claros y botón para mostrar u ocultar la contraseña. Por ahora es una simulación del lado del cliente, sin backend: cualquier dato válido permite ingresar.
- **Cierre de sesión** con ventana de confirmación.
- **Tema claro y oscuro**, que se puede cambiar desde la barra superior (escritorio) o la barra móvil. La elección se guarda en el navegador.
- **Panel de inicio (Dashboard)** con las siguientes secciones:
  - Resumen de actividad (horas estudiadas, materias, apuntes y exámenes).
  - Plan de hoy, con tareas que se pueden marcar como completadas.
  - Mis materias, con barra de progreso y próxima tarea.
  - Mis apuntes y próximos exámenes.
  - Mi progreso y técnicas de estudio.
  - **Pomodoro** con reloj circular: permite elegir entre sesión de enfoque (25 min) y descansos (5 y 15 min), iniciar, pausar, continuar y reiniciar, y cuenta las sesiones de enfoque completadas.
  - **Estadísticas** con un gráfico de barras de las horas de estudio por día de la semana.
  - **Asistente de estudio** en formato de chat. Las respuestas son simuladas (no hay una IA real conectada).
  - **Buscar en Wikipedia**: el estudiante escribe un tema y la aplicación muestra artículos relacionados con su resumen, imagen y enlace. Consume la API pública de Wikipedia (ver más abajo).
  - **Calendario** mensual con exámenes, entregas y sesiones de estudio. Al elegir un día se muestran sus eventos.
- **Navegación entre páginas** con React Router: login, panel de inicio y página 404.
- **Diseño responsive**: barra lateral y barra superior en escritorio; en celulares, una barra con menú desplegable que muestra todas las secciones.
- **Título propio en cada página** y uso de etiquetas semánticas (`header`, `main`, `section`, `aside`, `nav`).

> Los datos del panel (materias, apuntes, tareas, estadísticas) son datos de ejemplo definidos en `src/pages/Dashboard.jsx`. Los eventos del calendario y los exámenes están en `src/data/events.js` y se calculan a partir de la fecha actual.

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| [React](https://react.dev/) | Construcción de la interfaz con componentes |
| [Vite](https://vite.dev/) | Entorno de desarrollo y empaquetado |
| [React Router](https://reactrouter.com/) | Navegación entre páginas |
| [React Bootstrap](https://react-bootstrap.github.io/) y [Bootstrap](https://getbootstrap.com/) | Componentes y estilos de toda la interfaz |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | Íconos |
| [Axios](https://axios-http.com/) | Peticiones HTTP a la API de Wikipedia |
| [SweetAlert2](https://sweetalert2.github.io/) | Mensajes de error y avisos al usuario |
| [API de Wikipedia](https://www.mediawiki.org/wiki/API:Main_page) | Búsqueda de artículos (API pública de MediaWiki) |
| CSS propio mínimo (`src/index.css`) | Paleta de colores, tipografías y unas pocas clases de apoyo |
| [Vercel](https://vercel.com/) | Deploy |

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- npm (viene incluido con Node.js)
- Git

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone <URL-del-repositorio>
   cd studify-react
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear el archivo `.env` en la raíz del proyecto (ver la sección [Variables de entorno](#variables-de-entorno)).

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Luego abrir en el navegador la dirección que indica la terminal (normalmente `http://localhost:5173`).

### Otros comandos

| Comando | Descripción |
| --- | --- |
| `npm run build` | Genera la versión de producción en la carpeta `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |

## Variables de entorno

La URL de la API no está escrita en los componentes: se lee desde una variable de entorno. Para usarla, crear un archivo `.env` en la raíz del proyecto (al lado de `package.json`) con este contenido:

```
VITE_API_URL=https://es.wikipedia.org/w/api.php
```

Y leerla en el código con:

```js
const API_URL = import.meta.env.VITE_API_URL
```

Importante:

- El archivo `.env` **no se sube a GitHub**: está incluido en el `.gitignore`.
- Vite solo lee el `.env` al iniciar, por lo que hay que reiniciar `npm run dev` después de crearlo o modificarlo.
- Si la variable no está definida, el buscador muestra un aviso indicando que falta `VITE_API_URL`.

## Consumo de API (Wikipedia)

La sección **Buscar en Wikipedia** (`src/components/WikiSearch.jsx`) consume la API pública de Wikipedia en español.

- **Petición:** se hace con Axios (`axios.get`) dentro de un `useEffect`, usando `generator=search` para obtener los artículos relacionados con el tema, junto con su resumen, miniatura y enlace.
- **Cuándo se ejecuta:** al cargar el componente (con una búsqueda inicial) y cada vez que el estudiante envía una búsqueda nueva.
- **Estado:** los resultados, el estado de carga, el error y el texto buscado se guardan con `useState`.
- **Carga:** mientras se espera la respuesta se muestra un indicador de carga.
- **Errores:** si falla la conexión, la API responde con un error o tarda demasiado, se muestra una alerta con SweetAlert2 y un mensaje en pantalla con el botón "Reintentar". También se avisa si el texto a buscar es demasiado corto.
- **Cancelación:** si el estudiante hace otra búsqueda antes de recibir la respuesta anterior, la petición vieja se cancela con `AbortController`.

El contenido de Wikipedia está disponible bajo la licencia [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

## Rutas de la aplicación

| Ruta | Página |
| --- | --- |
| `/login` | Inicio de sesión |
| `/` | Panel de inicio (Dashboard) |
| `/inicio` | Redirige al panel de inicio (`/`) |
| `*` | Página 404 |

## Estructura del proyecto

```
studify-react/
├── public/                   # Íconos e imágenes estáticas
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── AppNavbar.jsx     # Barra móvil con menú desplegable
│   │   ├── CalendarView.jsx  # Calendario mensual
│   │   ├── ChatAssistant.jsx # Asistente en formato chat
│   │   ├── ExamCard.jsx
│   │   ├── NoteCard.jsx
│   │   ├── PanelSection.jsx  # Contenedor de cada sección del Dashboard
│   │   ├── PomodoroTimer.jsx # Reloj Pomodoro circular
│   │   ├── ProgressBar.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── Sidebar.jsx       # Barra lateral (escritorio)
│   │   ├── StatCard.jsx
│   │   ├── SubjectCard.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TechniqueCard.jsx
│   │   ├── ToneIcon.jsx
│   │   ├── TopBar.jsx        # Barra superior (escritorio): tema y cierre de sesión
│   │   ├── WeeklyChart.jsx   # Gráfico de barras semanal
│   │   └── WikiSearch.jsx    # Buscador que consume la API de Wikipedia
│   ├── data/
│   │   ├── events.js         # Eventos del calendario y exámenes
│   │   └── navItems.js       # Enlaces del menú
│   ├── hooks/
│   │   ├── usePageTitle.js   # Título del documento por página
│   │   └── useTheme.js       # Tema claro/oscuro
│   ├── layouts/
│   │   └── AppLayout.jsx     # Barras de navegación + contenido principal
│   ├── pages/
│   │   ├── login.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── alerts.js         # Alertas con SweetAlert2
│   │   └── dates.js          # Funciones de fechas
│   ├── App.jsx               # Definición de rutas
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos propios (paleta y clases de apoyo)
├── .env                      # Variables de entorno (local, no se sube a GitHub)
├── .gitignore
├── vercel.json               # Redirección para que funcionen las rutas en Vercel
├── index.html
└── package.json
```

## Conceptos de React aplicados

- **Componentes reutilizables:** la interfaz está dividida en componentes pequeños (tarjetas, encabezados de sección, paneles, barras de navegación).
- **Props:** los componentes reciben sus datos por props (por ejemplo, `StatCard` recibe `icon`, `title`, `value`, `description` y `tone`).
- **`map()`:** las listas de estadísticas, materias, apuntes, exámenes, tareas, técnicas, mensajes del chat, días del calendario y resultados de Wikipedia se renderizan con `map()`.
- **`useState`:** maneja el formulario de login, las tareas completadas, el tema, el menú móvil, la confirmación de cierre de sesión, el reloj Pomodoro, los mensajes del chat, el mes y día elegidos en el calendario, y los datos, la carga y los errores de la búsqueda en Wikipedia.
- **`useEffect`:**
  - En el Pomodoro, crea y limpia el temporizador cuando cambia el estado de la sesión.
  - En `useTheme`, aplica el tema en la página y lo guarda en el navegador cuando cambia.
  - En el chat, baja el scroll cuando llegan mensajes nuevos.
  - En `WikiSearch`, ejecuta la petición a la API al cargar y cuando cambia la búsqueda.
- **Hooks personalizados:** `usePageTitle` actualiza el título de la pestaña en cada página y `useTheme` administra el tema claro u oscuro.
- **React Router:** rutas, layout compartido con `Outlet`, enlaces con `Link`, redirecciones con `Navigate` y `useNavigate`.
- **Axios, SweetAlert2 y variables de entorno:** consumo de una API pública con carga, manejo de errores y avisos al usuario, sin escribir la URL en los componentes.

## Deploy en Vercel

1. Subir el repositorio a GitHub (verificando que `.env` no se suba).
2. Importar el proyecto en [Vercel](https://vercel.com/) y elegir el repositorio.
3. Vercel detecta Vite automáticamente (comando de build `npm run build`, carpeta de salida `dist`).
4. En **Settings → Environment Variables**, agregar `VITE_API_URL` con la URL de la API (`https://es.wikipedia.org/w/api.php`) y volver a hacer el deploy. Sin este paso, el buscador no funciona en producción.
5. El archivo `vercel.json` redirige todas las rutas a `index.html`, para que al recargar páginas como `/login` no aparezca un error 404.

## Autores

**Franco Tomás García** — **Bruno Busnelli**.