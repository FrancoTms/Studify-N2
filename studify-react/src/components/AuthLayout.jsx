import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

// Diseño compartido por las páginas de inicio de sesión y registro
export default function AuthLayout({ children }) {
  return (
    <div data-bs-theme="light" className="min-vh-100 studify-login-bg">
      <header className="bg-info-subtle border-bottom py-3">
        <Container fluid="lg">
          <Link
            to="/login"
            className="d-inline-flex align-items-center gap-2 text-primary fw-bold fs-3 text-decoration-none"
          >
            <img src="/img/mascota-sidebar.png" alt="" width="45" height="45" />
            Studify
          </Link>
        </Container>
      </header>

      <Container as="main" className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={11} xl={10}>
            <Card className="border-0 rounded-4 shadow overflow-hidden">
              <Row className="g-0">
                {/* Presentación de Studify */}
                <Col
                  md={5}
                  className="bg-info-subtle text-dark p-4 d-flex flex-column justify-content-between align-items-center text-center gap-3"
                >
                  <div>
                    <h2 className="h5 fw-bold text-primary">¡Preparémonos para estudiar!</h2>
                    <p className="text-secondary small">Tu compañero de estudio te está esperando.</p>
                  </div>

                  <img
                    src="/img/mascota-login.png"
                    alt="Gatito de Studify preparando su mochila"
                    className="img-fluid studify-login-cat"
                    style={{ maxWidth: 260 }}
                  />

                  <div>
                    <h3 className="h4 fw-bold">Aprendé a tu ritmo</h3>
                    <p className="small mb-0">Organizá tus materias, apuntes y exámenes en un solo lugar.</p>
                  </div>
                </Col>

                {/* Formulario */}
                <Col md={7} className="bg-body p-4 p-lg-5 d-flex align-items-center">
                  <div className="w-100 mx-auto" style={{ maxWidth: 420 }}>
                    {children}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
