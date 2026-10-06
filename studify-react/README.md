# Studify

Studify es una aplicación web para estudiantes que reúne en un solo lugar la organización del estudio: tareas del día, materias, apuntes, exámenes, progreso y técnicas de estudio.

Este repositorio (**Repositorio Nº 2**) es la migración del proyecto original en HTML, CSS y JavaScript a **React + Vite**, desarrollada para los Trabajos Prácticos Nº 5 y Nº 6.

- **Demo en línea:** `https://studify-n2.vercel.app/`

## Funcionalidades

- **Inicio de sesión** con validación de correo y contraseña, mensajes de error claros y botón para mostrar u ocultar la contraseña. Por ahora es una simulación del lado del cliente, sin backend: cualquier dato válido permite ingresar.
- **Panel de inicio (Dashboard)** con las siguientes secciones:
  - Resumen de actividad (horas estudiadas, materias, apuntes y exámenes).
  - Plan de hoy, con tareas que se pueden marcar como completadas.
  - Mis materias, con barra de progreso y próxima tarea.
  - Mis apuntes y próximos exámenes.
  - Mi progreso y estadísticas.
  - Técnicas de estudio, Pomodoro y asistente de IA (maquetas visuales).
- **Navegación entre páginas** con React Router: login, panel de inicio y página 404.
- **Diseño responsive**, con barra lateral en escritorio y barra superior en celulares.
- **Título propio en cada página** y uso de etiquetas semánticas (`header`, `main`, `section`, `aside`, `nav`).

> Los datos del panel (materias, apuntes, exámenes, tareas) son datos de ejemplo definidos en `src/pages/Dashboard.jsx`.

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| [React](https://react.dev/) | Construcción de la interfaz con componentes |
| [Vite](https://vite.dev/) | Entorno de desarrollo y empaquetado |
| [React Router](https://reactrouter.com/) | Navegación entre páginas |
| [React Bootstrap](https://react-bootstrap.github.io/) y [Bootstrap](https://getbootstrap.com/) | Componentes y estilos base |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | Íconos |
| CSS propio (`src/index.css`) | Identidad visual de Studify (paleta, tipografías, paneles) |
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

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Luego abrir en el navegador la dirección que indica la terminal (normalmente `http://localhost:5173`).

### Otros comandos

| Comando | Descripción |
| --- | --- |
| `npm run build` | Genera la versión de producción en la carpeta `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |

## Rutas de la aplicación

| Ruta | Página |
| --- | --- |
| `/` | Inicio de sesión |
| `/inicio` | Panel de inicio (Dashboard) |
| `*` | Página 404 |

## Estructura del proyecto

```
studify-react/
├── public/               # Íconos e imágenes estáticas
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── AppNavbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── StatCard.jsx
│   │   ├── SubjectCard.jsx
│   │   ├── NoteCard.jsx
│   │   ├── ExamCard.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TechniqueCard.jsx
│   │   ├── ProgressBar.jsx
│   │   └── ToneIcon.jsx
│   ├── hooks/
│   │   └── usePageTitle.js   # Título del documento por página
│   ├── layouts/
│   │   └── AppLayout.jsx     # Barra lateral + contenido principal
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx               # Definición de rutas
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos propios
├── vercel.json               # Redirección para que funcionen las rutas en Vercel
├── index.html
└── package.json
```

## Conceptos de React aplicados

- **Componentes reutilizables:** la interfaz está dividida en componentes pequeños (tarjetas, encabezados de sección, barra lateral).
- **Props:** los componentes reciben sus datos por props (por ejemplo, `StatCard` recibe `icon`, `title`, `value`, `description` y `tone`).
- **`map()`:** las listas de estadísticas, materias, apuntes, exámenes, tareas y técnicas se renderizan con `map()` a partir de arreglos de datos.
- **Estado (`useState`):** formulario de login con validación y tareas que se marcan como completadas.
- **React Router:** rutas, layout compartido con `Outlet`, enlaces con `Link` y redirección con `useNavigate`.
- **Hook personalizado:** `usePageTitle` actualiza el título de la pestaña en cada página.

## Deploy en Vercel

1. Subir el repositorio a GitHub.
2. Importar el proyecto en [Vercel](https://vercel.com/) y elegir el repositorio.
3. Vercel detecta Vite automáticamente (comando de build `npm run build`, carpeta de salida `dist`).
4. El archivo `vercel.json` redirige todas las rutas a `index.html`, para que al recargar páginas como `/inicio` no aparezca un error 404.

## Autores

**Franco Tomás García** — **Bruno Busnelli**.