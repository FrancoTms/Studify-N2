import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import FormModal from './FormModal'
import SubjectSelect from './SubjectSelect'
import { EVENT_TYPES } from '../data/events'
import { todayISO } from '../utils/dates'

// Exámenes, entregas y sesiones de estudio planificadas
export default function EventFormModal({ event, defaults = {}, onSave, onDelete, onHide }) {
  const [values, setValues] = useState(() => ({
    title: event?.title ?? '',
    subjectId: event?.subjectId ?? defaults.subjectId ?? '',
    type: event?.type ?? defaults.type ?? 'exam',
    date: event?.date ?? defaults.date ?? todayISO(),
    time: event?.time ?? '',
  }))
  const [errors, setErrors] = useState({})

  const set = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const handleSubmit = () => {
    const found = {}
    const title = values.title.trim()
    if (title.length < 3) found.title = 'El título debe tener al menos 3 caracteres.'
    if (!values.date) found.date = 'Elegí una fecha.'
    setErrors(found)
    if (Object.keys(found).length) return
    onSave({ ...values, title, subjectId: values.subjectId || null })
    onHide()
  }

  return (
    <FormModal
      title={event ? 'Editar evento' : 'Nuevo evento'}
      submitLabel={event ? 'Guardar cambios' : 'Agregar'}
      onHide={onHide}
      onSubmit={handleSubmit}
      onDelete={event && onDelete ? () => onDelete(event) : undefined}
    >
      <Form.Group className="mb-3" controlId="event-type">
        <Form.Label>Tipo</Form.Label>
        <Form.Select value={values.type} onChange={(e) => set('type', e.target.value)}>
          {Object.entries(EVENT_TYPES).map(([key, t]) => (
            <option key={key} value={key}>{t.label}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="event-title">
        <Form.Label>Título</Form.Label>
        <Form.Control
          autoFocus
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ej.: Parcial Unidad 1 y 2"
          isInvalid={!!errors.title}
          maxLength={120}
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="event-subject">
        <Form.Label>Materia</Form.Label>
        <SubjectSelect value={values.subjectId} onChange={(v) => set('subjectId', v)} />
      </Form.Group>

      <Row className="g-3">
        <Col sm={7}>
          <Form.Group controlId="event-date">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={values.date}
              onChange={(e) => set('date', e.target.value)}
              isInvalid={!!errors.date}
            />
            <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={5}>
          <Form.Group controlId="event-time">
            <Form.Label>Hora <span className="text-secondary">(opcional)</span></Form.Label>
            <Form.Control type="time" value={values.time} onChange={(e) => set('time', e.target.value)} />
          </Form.Group>
        </Col>
      </Row>
    </FormModal>
  )
}
