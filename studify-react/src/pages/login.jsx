import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import AuthLayout from '../components/AuthLayout'
import PasswordField from '../components/PasswordField'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/contexts'
import { cleanErrors, validateEmail } from '../utils/validation'

export default function Login() {
  usePageTitle('Iniciar sesión | Studify')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAsGuest } = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Después de entrar, vuelve a la página que el usuario quería ver
  const goNext = () => navigate(location.state?.from ?? '/', { replace: true })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = cleanErrors({
      email: validateEmail(values.email),
      password: values.password ? undefined : 'Ingresá tu contraseña.',
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      await login(values)
      goNext()
    } catch (err) {
      setErrors({ [err.field ?? 'email']: err.message })
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    goNext()
  }

  return (
    <AuthLayout>
      <h1 className="h3 fw-bold mb-2">Bienvenido de nuevo</h1>
      <p className="text-primary fs-5 mb-4">Iniciá sesión para continuar</p>

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
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <PasswordField
          id="login-password"
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={loading}>
          {loading && <Spinner size="sm" className="me-2" />}
          Iniciar sesión
        </Button>
      </Form>

      <p className="text-center small mt-3 mb-0">
        ¿No tenés cuenta? <Link to="/registro" state={location.state}>Registrate gratis</Link>
      </p>

      <hr className="my-4" />

      <p className="text-center small mb-0">
        ¿Querés conocer Studify?{' '}
        <Button variant="link" size="sm" className="p-0 align-baseline" onClick={handleGuest}>
          Explorar como invitado
        </Button>
      </p>
    </AuthLayout>
  )
}
