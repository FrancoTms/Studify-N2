import Swal from 'sweetalert2'

// SweetAlert2 no conoce el tema de Bootstrap, así que adaptamos los colores al tema activo
function baseOptions() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
  return {
    background: dark ? '#112326' : '#fffdf8',
    color: dark ? '#e7f1ee' : '#19302d',
    confirmButtonColor: '#0f766e',
    confirmButtonText: 'Entendido',
  }
}

export const showError = (text) =>
  Swal.fire({ ...baseOptions(), icon: 'error', title: 'No pudimos completar la búsqueda', text })

export const showWarning = (text) =>
  Swal.fire({ ...baseOptions(), icon: 'warning', title: 'Revisá tu búsqueda', text })
