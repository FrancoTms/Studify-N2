import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import usePageTitle from '../hooks/usePageTitle'

const highlights = [
  { icon: 'bi-check2-square', text: 'Plan de hoy con tus tareas prioritarias' },
  { icon: 'bi-alarm-fill', text: 'Pomodoro y modo foco para estudiar sin distracciones' },
  { icon: 'bi-bar-chart-fill', text: 'Seguimiento de tu progreso semanal' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Ingresá tu correo electrónico.'
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Revisá el formato, por ejemplo nombre@mail.com.'
  if (!password) errors.password = 'Ingresá tu contraseña.'
  else if (password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  return errors
}

function Brand({ className = '', markClassName = 'bg-primary text-white' }) {
  return (
    <Link to="/" className={`d-inline-flex align-items-center gap-2 fw-bold fs-4 text-reset ${className}`}>
      <span className={`rounded-3 p-2 lh-1 ${markClassName}`}>
        <i className="bi bi-book-half fs-5"></i>
      </span>
      Studify
    </Link>
  )
}

export default function Login() {
  usePageTitle('Iniciar sesión | Studify')
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length === 0) navigate('/inicio')
  }



return (
  <div data-bs-theme="light" className="min-vh-100 studify-login-bg">
    <header className="bg-info-subtle border-bottom py-3">
      <Container fluid="lg">
        <Link
          to="/inicio"
          className="d-inline-flex align-items-center gap-2
                     text-primary fw-bold fs-3 text-decoration-none"
        >
          <img
            src="/img/mascota-sidebar.png"
            alt=""
            width="45"
            height="45"
          />
          Studify
        </Link>
      </Container>
    </header>

    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={11} xl={10}>
          <Card className="border-0 rounded-4 shadow overflow-hidden">
            <Row className="g-0">
              {/* Presentación de Studify */}
              <Col
                md={5 }
                className="bg-info-subtle text-dark p-4 d-flex flex-column
             justify-content-between align-items-center text-center gap-3"
              >
                <div>
                  <h2 className="h5 fw-bold text-primary">
                    ¡Preparémonos para estudiar!
                  </h2>
                  <p className="text-secondary small">
                    Tu compañero de estudio te está esperando.
                  </p>
                </div>

                <img
  src="/img/mascota-login.png"
  alt="Gatito de Studify preparando su mochila"
  className="img-fluid studify-login-cat"
  style={{ maxWidth: 260 }}
/>

                <div>
                  <h3 className="h4 fw-bold">
                    Aprendé a tu ritmo
                  </h3>
                  <p className="small mb-0">
                    Organizá tus materias, apuntes
                    y exámenes en un solo lugar.
                  </p>
                </div>
              </Col>

              {/* Formulario de ingreso */}
              <Col
                md={7}
                className="bg-body p-4 p-lg-5 d-flex align-items-center"
              >
                <div className="w-100 mx-auto" style={{ maxWidth: 420 }}>
                  <h1 className="h3 fw-bold mb-2">
                    Bienvenido de nuevo
                  </h1>

                  <p className="text-primary fs-5 mb-4">
                    Iniciá sesión para continuar
                  </p>

                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="login-email">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="nombre@mail.com"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="login-password">
                      <Form.Label>Contraseña</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Mínimo 6 caracteres"
                          autoComplete="current-password"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                        >
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 fw-semibold"
                    >
                      Iniciar sesión
                    </Button>
                  </Form>

                  <hr className="my-4" />

                  <p className="text-center small mb-0">
                    ¿Querés conocer Studify?{' '}
                    <Link to="/inicio">
                      Explorar sin iniciar sesión
                    </Link>
                  </p>
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