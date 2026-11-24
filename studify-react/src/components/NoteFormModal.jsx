import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FormModal from './FormModal'
import SubjectSelect from './SubjectSelect'

export default function NoteFormModal({ note, defaults = {}, onSave, onDelete, onHide }) {
  const [values, setValues] = useState(() => ({
    title: note?.title ?? '',
    subjectId: note?.subjectId ?? defaults.subjectId ?? '',
    content: note?.content ?? '',
  }))
  const [error, setError] = useState('')

  const set = (field, value) => setValues((v) => ({ ...v, [field]: value }))

  const handleSubmit = () => {
    const title = values.title.trim()
    if (title.length < 2) {
      setError('El apunte necesita un título.')
      return
    }
    onSave({ title, subjectId: values.subjectId || null, content: values.content.trim() })
    onHide()
  }

  return (
    <FormModal
      size="lg"
      title={note ? 'Editar apunte' : 'Nuevo apunte'}
      submitLabel={note ? 'Guardar cambios' : 'Crear apunte'}
      onHide={onHide}
      onSubmit={handleSubmit}
      onDelete={note && onDelete ? () => onDelete(note) : undefined}
    >
      <Form.Group className="mb-3" controlId="note-title">
        <Form.Label>Título</Form.Label>
        <Form.Control
          autoFocus={!note}
          value={values.title}
          onChange={(e) => {
            set('title', e.target.value)
            setError('')
          }}
          placeholder="Ej.: Normalización de bases de datos"
          isInvalid={!!error}
          maxLength={120}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="note-subject">
        <Form.Label>Materia</Form.Label>
        <SubjectSelect value={values.subjectId} onChange={(v) => set('subjectId', v)} />
      </Form.Group>

      <Form.Group controlId="note-content">
        <Form.Label>Contenido</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={values.content}
          onChange={(e) => set('content', e.target.value)}
          placeholder="Escribí tu resumen, definiciones, fórmulas…"
        />
        <Form.Text>{values.content.length} caracteres</Form.Text>
      </Form.Group>
    </FormModal>
  )
}
