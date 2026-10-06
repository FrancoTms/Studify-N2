import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Página no encontrada | Studify')

  return (
    <section className="text-center py-5">
      <h1 className="display-6 fw-bold mb-2">No encontramos esa página</h1>
      <p className="text-secondary mb-4">Puede que el enlace esté roto o que la página ya no exista.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </section>
  )
}
