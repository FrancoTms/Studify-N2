# Studify

Studify es una aplicación web para estudiantes que reúne en un solo lugar la organización del estudio: tareas del día, materias, apuntes, exámenes, calendario, progreso, técnicas de estudio, Pomodoro y búsqueda de información en Wikipedia.

Este repositorio (**Repositorio Nº 2**) es la migración del proyecto original en HTML, CSS y JavaScript a **React + Vite**, desarrollada para los Trabajos Prácticos Nº 5 al Nº 8.

- **Demo en línea:** `https://studify-n2.vercel.app/`

## Funcionalidades

Studify funciona completo en el navegador: no necesita backend. Las cuentas y los datos de estudio se guardan en `localStorage`, separados por usuario.

- **Cuentas:** registro con nombre, correo y contraseña (la contraseña se guarda como hash SHA-256, nunca en texto plano), inicio de sesión que valida el correo y la contraseña, y **modo invitado** con datos de ejemplo. Las páginas internas están protegidas: sin sesión se redirige al login y, al entrar, se vuelve a la página que se quería ver.
- **Cierre de sesión** con ventana de confirmación.
- **Inicio (Dashboard):** saludo con el nombre del usuario, resumen calculado (horas de la semana, materias, apuntes y exámenes próximos), plan de hoy con alta rápida de tareas, materias con su progreso, apuntes recientes, próximos exámenes y progreso semanal. Si la cuenta está vacía, ofrece crear una materia o cargar datos de ejemplo.
- **Plan de hoy (tareas):** crear, editar, completar y eliminar tareas con materia, prioridad y fecha límite. Filtros Hoy / Pendientes / Completadas / Todas, búsqueda, filtro por materia y borrado de completadas. Las tareas vencidas se marcan en rojo.
- **Mis materias:** crear, editar y eliminar materias con ícono y color. El progreso se calcula con las tareas completadas. Al borrar una materia, sus tareas, apuntes y exámenes no se pierden: quedan como "Sin materia".
- **Archivos por materia** (`/materias/:id`): cada materia tiene su página para organizar el material en **unidades** y **temas**. Se pueden subir PDF, Word, PowerPoint, Excel, imágenes, audio, video, ZIP y cualquier otro archivo (hasta 50 MB cada uno), eligiéndolos o arrastrándolos, y varios a la vez. Los archivos se pueden ver dentro de la app (PDF, imágenes, texto, audio y video), descargar, renombrar, mover a otra unidad o tema, buscar y eliminar. Las unidades se pueden reordenar y plegar.
- **Mis apuntes:** crear, editar y eliminar apuntes, buscar en títulos y contenido, filtrar por materia y ordenar.
- **Próximos exámenes:** exámenes y entregas con cuenta regresiva, filtros por tipo y materia, y fechas pasadas.
- **Calendario** mensual con los eventos guardados: se elige un día para agregar, editar o eliminar eventos, y también se ven las tareas que vencen ese día.
- **Pomodoro:** enfoque y descansos con duración configurable. Se elige la materia, y cada sesión terminada se guarda y suma a las estadísticas. El reloj sigue corriendo aunque se cambie de página (se ve en la barra superior), y suena y avisa al terminar.
- **Estadísticas:** tiempo de hoy, de la semana, racha de días y total; objetivo semanal, materias al día y tareas completadas; gráfico semanal con navegación entre semanas y tiempo por materia.
- **Técnicas de estudio** con los pasos de cada una y acceso directo a la sección donde aplicarla.
- **Asistente de estudio con IA (Gemini por defecto, gratis):** chat que conoce tus materias, tareas, exámenes, apuntes y progreso, y mantiene el hilo de la conversación. Si la IA no está disponible (sin clave, sin conexión o con demasiada demanda), responde en **modo básico** con respuestas predefinidas sobre tus datos.
- **Buscar en Wikipedia:** muestra artículos con resumen, imagen y enlace, y permite **guardar un resultado como apunte**.
- **Configuración:** editar nombre, cambiar contraseña, tema claro/oscuro, objetivo semanal y tiempos del Pomodoro; exportar e importar una copia de los datos (JSON), cargar datos de ejemplo, borrar todos los datos o eliminar la cuenta.
- **Tema claro y oscuro**, que se guarda en el navegador.
- **Diseño responsive**: barra lateral y barra superior en escritorio; en celulares, una barra con menú desplegable.
- **Título propio en cada página** y uso de etiquetas semánticas (`header`, `main`, `section`, `aside`, `nav`).

> Como los datos viven en el navegador, cada navegador o dispositivo tiene sus propias cuentas. Para pasar los datos a otro lado, usar **Exportar copia** e **Importar copia** en Configuración.

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
const API_URL = import.meta.env.VITE_API_URL || 'https://es.wikipedia.org/w/api.php'
```

Importante:

- El archivo `.env` **no se sube a GitHub**: está incluido en el `.gitignore`.
- Vite solo lee el `.env` al iniciar, por lo que hay que reiniciar `npm run dev` después de crearlo o modificarlo.
- Si la variable no está definida, se usa la API de Wikipedia en español (`https://es.wikipedia.org/w/api.php`).

## Archivos de las materias

Los archivos no entran en `localStorage` (admite unos 5 MB de texto), así que se guardan en **IndexedDB**, la base de datos del navegador, que admite archivos binarios grandes:

- `src/utils/fileStore.js` guarda el contenido de cada archivo (Blob) en IndexedDB con su id.
- Los datos del archivo (nombre, tipo, tamaño, materia, unidad y tema) se guardan junto al resto en `DataProvider`, igual que las unidades y los temas.
- Al subir el primer archivo se le pide al navegador almacenamiento persistente, para que no lo borre si se queda sin espacio.
- Al eliminar un tema, una unidad o una materia, se borran también sus archivos.
- En **Configuración** se ve cuánto espacio ocupan los archivos. La copia exportada (JSON) incluye todo menos los archivos.

> Como el resto de Studify, los archivos quedan en ese navegador: no se sincronizan entre dispositivos y se pierden si se borran los datos del sitio.

## Asistente con IA

El chat de **IA Asistente** usa un modelo de IA real. Por defecto es **Google Gemini**, que tiene nivel gratuito. La clave **no puede ir en el frontend**, porque cualquiera la vería desde el navegador. Por eso hay una función serverless en `api/chat.js`:

1. El navegador manda a `/api/chat` la conversación y un resumen de los datos del estudiante (`src/utils/aiContext.js`).
2. La función agrega las instrucciones del asistente, llama a la IA con la clave guardada en el servidor y devuelve el texto de la respuesta.
3. Si algo falla (sin clave, sin conexión o límite alcanzado), el chat avisa y responde en modo básico.

**Proveedores disponibles** (se eligen con `AI_PROVIDER`):

| `AI_PROVIDER` | Clave | Modelo por defecto | Costo |
| --- | --- | --- | --- |
| `gemini` (por defecto) | `GEMINI_API_KEY` | `gemini-3.8-flash` (`GEMINI_MODEL`) | Nivel gratuito con límites |
| `groq` | `GROQ_API_KEY` | `openai/gpt-oss-120b` (`GROQ_MODEL`) | Nivel gratuito con límites |
| `anthropic` | `ANTHROPIC_API_KEY` | `claude-haiku-5-5` (`ANTHROPIC_MODEL`) | Pago por uso |

**Configuración local:**

1. Crear una clave gratis en [Google AI Studio](https://aistudio.google.com/apikey).
2. En el `.env` (ver `.env.example`), escribir `GEMINI_API_KEY=tu-clave`.
3. Correr `npm run dev`. Funciona directamente: `vite.config.js` incluye un plugin que ejecuta `api/chat.js` en el servidor de desarrollo.

**En Vercel:** agregar `GEMINI_API_KEY` en **Settings → Environment Variables** y volver a hacer el deploy. Para usar otro proveedor, agregar también `AI_PROVIDER` y su clave.

**Protecciones:** la función acepta solo `POST`, limita la cantidad y el largo de los mensajes, corta las respuestas largas y tiene un límite de 10 preguntas por minuto por IP.

> En el nivel gratuito de Gemini, Google puede usar el contenido de las consultas para mejorar sus productos. No escribas datos personales sensibles en el chat.

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
| `/registro` | Crear cuenta |
| `/` | Panel de inicio (Dashboard) |
| `/inicio` | Redirige al panel de inicio (`/`) |
| `/tareas` | Plan de hoy y todas las tareas (acepta `?materia=<id>`) |
| `/materias` | Mis materias |
| `/materias/:id` | Página de una materia: unidades, temas y archivos |
| `/apuntes` | Mis apuntes (acepta `?materia=<id>`) |
| `/examenes` | Próximos exámenes y entregas (acepta `?materia=<id>`) |
| `/calendario` | Calendario |
| `/pomodoro` | Pomodoro y sesiones de hoy |
| `/estadisticas` | Mi progreso y estadísticas |
| `/tecnicas` | Técnicas de estudio |
| `/asistente` | Asistente de estudio |
| `/wikipedia` | Buscar en Wikipedia |
| `/configuracion` | Perfil, preferencias y datos |
| `*` | Página 404 |

Todas las rutas, salvo `/login` y `/registro`, necesitan una sesión iniciada.

## Estructura del proyecto

```
studify-react/
├── public/                    # Íconos e imágenes estáticas
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── AppNavbar.jsx      # Barra móvil con menú desplegable
│   │   ├── AuthLayout.jsx     # Diseño de login y registro
│   │   ├── CalendarView.jsx   # Calendario mensual
│   │   ├── ChatAssistant.jsx  # Asistente en formato chat
│   │   ├── EmptyState.jsx     # Mensaje para listas vacías
│   │   ├── EventFormModal.jsx # Formulario de exámenes, entregas y estudio
│   │   ├── FileItem.jsx       # Fila de un archivo con sus acciones
│   │   ├── FileUploadModal.jsx # Subida de archivos (selector y arrastrar)
│   │   ├── FileEditModal.jsx  # Renombrar o mover un archivo
│   │   ├── FilePreviewModal.jsx # Vista previa de PDF, imágenes, texto, audio y video
│   │   ├── FormModal.jsx      # Ventana base de los formularios
│   │   ├── NameFormModal.jsx  # Crear o renombrar unidades y temas
│   │   ├── NoteFormModal.jsx  # Formulario de apuntes
│   │   ├── PomodoroBadge.jsx  # Reloj chiquito en la barra superior
│   │   ├── PomodoroTimer.jsx  # Reloj Pomodoro circular
│   │   ├── RouteGuards.jsx    # RequireAuth y PublicOnly
│   │   ├── SubjectFormModal.jsx
│   │   ├── SubjectSelect.jsx  # Selector de materias
│   │   ├── TaskFormModal.jsx
│   │   ├── UnitTopicSelect.jsx # Selector de unidad y tema
│   │   ├── WikiSearch.jsx     # Buscador que consume la API de Wikipedia
│   │   └── ...                # Tarjetas, encabezados, barras, etc.
│   ├── context/
│   │   ├── contexts.js        # Contextos y hooks useAuth, useData, usePomodoro
│   │   ├── AuthProvider.jsx   # Cuentas y sesión
│   │   ├── DataProvider.jsx   # Materias, unidades, temas, archivos, tareas, apuntes, eventos, sesiones y ajustes
│   │   └── PomodoroProvider.jsx # Temporizador global
│   ├── data/
│   │   ├── catalog.js         # Íconos, colores, prioridades y modos del Pomodoro
│   │   ├── events.js          # Tipos de eventos
│   │   ├── mascots.js         # Mascota de cada sección
│   │   ├── navItems.js        # Enlaces del menú
│   │   └── sampleData.js      # Datos de ejemplo y valores por defecto
│   ├── hooks/
│   │   ├── usePageTitle.js    # Título del documento por página
│   │   └── useTheme.js        # Tema claro/oscuro
│   ├── layouts/
│   │   └── AppLayout.jsx      # Providers de datos + barras de navegación + contenido
│   ├── pages/                 # Una página por ruta (Dashboard, Tasks, Subjects, Notes, ...)
│   ├── utils/
│   │   ├── aiContext.js       # Resumen de los datos del estudiante para la IA
│   │   ├── alerts.js          # Alertas, confirmaciones y avisos con SweetAlert2
│   │   ├── dates.js           # Funciones de fechas
│   │   ├── fileStore.js       # Contenido de los archivos en IndexedDB
│   │   ├── files.js           # Tamaños, íconos y tipos de archivo
│   │   ├── id.js              # Generador de ids
│   │   ├── stats.js           # Cálculos de progreso, horas y próximos eventos
│   │   ├── storage.js         # Lectura y escritura en localStorage
│   │   └── validation.js      # Validaciones de formularios
│   ├── App.jsx                # Definición de rutas
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos propios (paleta y clases de apoyo)
├── api/
│   └── chat.js                # Función serverless que llama a la IA (la clave queda en el servidor)
├── .env.example               # Variables de entorno de ejemplo
├── .gitignore
├── vercel.json                # Redirección para que funcionen las rutas en Vercel
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
- **IndexedDB:** almacenamiento de archivos binarios en el navegador, con transacciones y promesas (`src/utils/fileStore.js`).
- **Context API:** `AuthProvider` (sesión), `DataProvider` (datos de estudio guardados en `localStorage`) y `PomodoroProvider` (reloj global) comparten el estado con toda la app mediante los hooks `useAuth`, `useData` y `usePomodoro`.
- **Formularios controlados con validación:** registro, login, materias, tareas, apuntes, eventos y configuración muestran los errores debajo de cada campo.
- **Hooks personalizados:** `usePageTitle` actualiza el título de la pestaña en cada página y `useTheme` administra el tema claro u oscuro.
- **React Router:** rutas, layout compartido con `Outlet`, enlaces con `Link`, redirecciones con `Navigate` y `useNavigate`, rutas protegidas, parámetros de búsqueda con `useSearchParams` y `useOutletContext`.
- **Axios, SweetAlert2 y variables de entorno:** consumo de una API pública con carga, manejo de errores y avisos al usuario, sin escribir la URL en los componentes.

## Deploy en Vercel

1. Subir el repositorio a GitHub (verificando que `.env` no se suba).
2. Importar el proyecto en [Vercel](https://vercel.com/) y elegir el repositorio.
3. Vercel detecta Vite automáticamente (comando de build `npm run build`, carpeta de salida `dist`).
4. En **Settings → Environment Variables**, agregar `VITE_API_URL` con la URL de la API (`https://es.wikipedia.org/w/api.php`) y volver a hacer el deploy. Es opcional: si no se define, se usa la Wikipedia en español.
5. Agregar también `GEMINI_API_KEY` para que funcione el asistente con IA.
6. El archivo `vercel.json` redirige todas las rutas (menos `/api/...`) a `index.html`, para que al recargar páginas como `/login` no aparezca un error 404.

## Autores

**Franco Tomás García** — **Bruno Busnelli**.