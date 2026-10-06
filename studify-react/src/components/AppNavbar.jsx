import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

export default function AppNavbar({ brand = 'Studify' }) {
  return (
    <Navbar expand="lg" className="bg-white border-bottom d-lg-none sticky-top">
      <Container fluid>
        <Navbar.Toggle aria-controls="studify-mobile-nav" />
        <Navbar.Brand as={Link} to="/inicio" className="fw-bold text-primary">
          {brand}
        </Navbar.Brand>
        <Button variant="light" className="rounded-circle js-theme-toggle" aria-label="Cambiar tema">
          <i className="bi bi-moon-stars js-theme-icon"></i>
        </Button>
      </Container>
    </Navbar>
  )
}
