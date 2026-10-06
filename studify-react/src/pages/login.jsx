import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


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

function Brand({ className = '' }) {
  return (
    <Link to="/" className={`login-brand ${className}`}>
      <span className="login-brand-mark"><i className="bi bi-book-half"></i></span>
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
    if (Object.keys(found).length === 0) navigate('/')
  }

  return (
    <div className="login-page">
      <aside className="login-aside">
        <Brand />
        <div>
          <h2>Tu espacio para enfocarte.</h2>
          <p>Organizá tus materias, apuntes y exámenes en un solo lugar.</p>
          <ul className="list-unstyled d-grid gap-3 mb-0">
            {highlights.map(({ icon, text }) => (
              <li key={text} className="login-highlight">
                <span><i className={`bi ${icon}`}></i></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="login-main">
        <Brand className="login-brand--mobile" />
        <section className="login-card" aria-labelledby="login-title">
          <h1 id="login-title">Ingresá a Studify</h1>
          <p className="text-secondary mb-4">Retomá tus materias, apuntes y tareas donde los dejaste.</p>

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
                aria-describedby="login-email-error"
              />
              {errors.email && <div id="login-email-error" className="invalid-feedback d-block">{errors.email}</div>}
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Contraseña</Form.Label>
              <div className="login-password">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  aria-describedby="login-password-error"
                />
                <button
                  type="button"
                  className="login-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password && <div id="login-password-error" className="invalid-feedback d-block">{errors.password}</div>}
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" className="w-100">Iniciar sesión</Button>
          </Form>

          <p className="login-alt mb-0 text-secondary">
            ¿Querés ver la app antes? <Link to="/">Explorar sin iniciar sesión</Link>
          </p>
        </section>
      </main>
    </div>
  )
}
