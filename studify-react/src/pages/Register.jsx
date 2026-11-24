import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import AuthLayout from '../components/AuthLayout'
import PasswordField from '../components/PasswordField'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/contexts'
import { cleanErrors, validateEmail, validatePassword } from '../utils/validation'

export default function Register() {
  usePageTitle('Crear cuenta | Studify')
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = cleanErrors({
      name: values.name.trim().length < 2 ? 'Ingresá tu nombre.' : undefined,
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: values.confirm !== values.password ? 'Las contraseñas no coinciden.' : undefined,
    })
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      await register(values)
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      setErrors({ email: err.message })
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="h3 fw-bold mb-2">Creá tu cuenta</h1>
      <p className="text-primary fs-5 mb-4">Empezá a organizar tu estudio</p>

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="register-name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="name"
            placeholder="¿Cómo te llamás?"
            autoComplete="given-name"
            value={values.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            maxLength={40}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="register-email">
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
          id="register-password"
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordField
          id="register-confirm"
          label="Repetí la contraseña"
          name="confirm"
          autoComplete="new-password"
          placeholder="Escribila de nuevo"
          value={values.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />

        <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={loading}>
          {loading && <Spinner size="sm" className="me-2" />}
          Crear cuenta
        </Button>
      </Form>

      <p className="text-center small mt-3 mb-0">
        ¿Ya tenés cuenta? <Link to="/login" state={location.state}>Iniciá sesión</Link>
      </p>
    </AuthLayout>
  )
}
