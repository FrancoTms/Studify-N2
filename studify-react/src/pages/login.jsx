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
    <Container fluid className="p-0">
      <Row className="g-0 min-vh-100">
        <Col lg={5} className="bg-hero d-none d-lg-flex flex-column justify-content-between p-5 text-white">
          <Brand markClassName="bg-white bg-opacity-10 text-white" />
          <div>
            <h2 className="display-6 fw-bold mb-2">Tu espacio para enfocarte.</h2>
            <p className="text-white-50 mb-4">Organizá tus materias, apuntes y exámenes en un solo lugar.</p>
            <Stack as="ul" gap={3} className="list-unstyled mb-0">
              {highlights.map(({ icon, text }) => (
                <Stack as="li" direction="horizontal" gap={3} key={text}>
                  <span className="rounded-3 bg-white bg-opacity-10 text-warning p-2 lh-1 flex-shrink-0">
                    <i className={`bi ${icon}`}></i>
                  </span>
                  {text}
                </Stack>
              ))}
            </Stack>
          </div>
        </Col>

        <Col xs={12} lg={7} as="main" className="d-flex flex-column align-items-center justify-content-center gap-4 p-4">
          <Brand className="d-lg-none" />
          <Card className="w-100 border-0 shadow-sm rounded-4" style={{ maxWidth: 440 }}>
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold mb-1">Ingresá a Studify</h1>
              <p className="text-secondary mb-4">Retomá tus materias, apuntes y tareas donde los dejaste.</p>

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="login-email">
                  <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="nombre@mail.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="login-password">
                  <Form.Label className="fw-semibold">Contraseña</Form.Label>
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
                      variant="outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" variant="primary" size="lg" className="w-100">Iniciar sesión</Button>
              </Form>

              <hr className="my-4" />
              <p className="text-secondary text-center small mb-0">
                ¿Querés ver la app antes? <Link to="/inicio" className="fw-semibold">Explorar sin iniciar sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}