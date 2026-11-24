import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FormModal from './FormModal'

// Formulario de un solo campo: se usa para crear o renombrar unidades y temas
export default function NameFormModal({ title, label, placeholder, initial = '', submitLabel, existing = [], onSave, onHide }) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const clean = name.trim()
    if (clean.length < 2) {
      setError('Escribí al menos 2 caracteres.')
      return
    }
    const repeated = existing.some(
      (n) => n.toLowerCase() === clean.toLowerCase() && n.toLowerCase() !== initial.toLowerCase(),
    )
    if (repeated) {
      setError('Ya existe uno con ese nombre.')
      return
    }
    onSave(clean)
    onHide()
  }

  return (
    <FormModal title={title} submitLabel={submitLabel} onHide={onHide} onSubmit={handleSubmit}>
      <Form.Group controlId="name-form-input">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          placeholder={placeholder}
          isInvalid={!!error}
          maxLength={80}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>
    </FormModal>
  )
}
