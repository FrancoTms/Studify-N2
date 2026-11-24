import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

// Campo de contraseña con botón para mostrarla u ocultarla
export default function PasswordField({ id, label, name, value, onChange, error, autoComplete, placeholder = 'Mínimo 6 caracteres' }) {
  const [show, setShow] = useState(false)

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type={show ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          isInvalid={!!error}
        />
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </Button>
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  )
}
