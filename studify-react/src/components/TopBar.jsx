import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'

export default function TopBar({ theme = 'light', onToggleTheme, onLogout }) {
  const isDark = theme === 'dark'

  return (
    <header className="d-none d-lg-block bg-body border-bottom sticky-top">
      <Container fluid className="px-5 py-2" style={{ maxWidth: 1180 }}>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill px-3"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-2`}></i>
            {isDark ? 'Tema claro' : 'Tema oscuro'}
          </Button>
          <Button variant="outline-secondary" size="sm" className="rounded-pill px-3" onClick={onLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar sesión
          </Button>
        </Stack>
      </Container>
    </header>
  )
}
