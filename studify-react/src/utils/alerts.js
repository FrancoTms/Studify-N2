import Swal from 'sweetalert2'

// SweetAlert2 no conoce el tema de Bootstrap, así que adaptamos los colores al tema activo
function baseOptions() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
  return {
    background: dark ? '#112326' : '#fffdf8',
    color: dark ? '#e7f1ee' : '#19302d',
    confirmButtonColor: '#238fbb',
    confirmButtonText: 'Entendido',
  }
}

export const showError = (text, title = 'No pudimos completar la búsqueda') =>
  Swal.fire({ ...baseOptions(), icon: 'error', title, text })

export const showWarning = (text, title = 'Revisá tu búsqueda') =>
  Swal.fire({ ...baseOptions(), icon: 'warning', title, text })

// Pide confirmación antes de una acción que no se puede deshacer. Devuelve true si el usuario acepta.
export async function confirmAction({ title, text, confirmText = 'Eliminar', icon = 'warning' }) {
  const result = await Swal.fire({
    ...baseOptions(),
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
    reverseButtons: true,
    focusCancel: true,
  })
  return result.isConfirmed
}

// Aviso corto en la esquina que se cierra solo
export const showToast = (title, icon = 'success') =>
  Swal.fire({
    ...baseOptions(),
    toast: true,
    position: 'bottom-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  })
