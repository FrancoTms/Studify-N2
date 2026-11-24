import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import FormModal from './FormModal'
import SubjectSelect from './SubjectSelect'
import { PRIORITIES } from '../data/catalog'
import { todayISO } from '../utils/dates'

// task = tarea a editar; si no viene, se crea una nueva con los valores de "defaults"
export default function TaskFormModal({ task, defaults = {}, onSave, onDelete, onHide }) {
  const [values, setValues] = useState(() => ({
    title: task?.title ?? '',
    subjectId: task?.subjectId ?? defaults.subjectId ?? '',
    priority: task?.priority ?? 'Normal',
    dueDate: task?.dueDate ?? defaults.dueDate ?? todayISO(),
  }))
  const [error, setError] = useState('')

  const set = (field) => (value) => setValues((v) => ({ ...v, [field]: value }))

  const handleSubmit = () => {
    const title = values.title.trim()
    if (title.length < 3) {
      setError('El título debe tener al menos 3 caracteres.')
      return
    }
    onSave({ ...values, title, subjectId: values.subjectId || null, dueDate: values.dueDate || null })
    onHide()
  }

  return (
    <FormModal
      title={task ? 'Editar tarea' : 'Nueva tarea'}
      submitLabel={task ? 'Guardar cambios' : 'Crear tarea'}
      onHide={onHide}
      onSubmit={handleSubmit}
      onDelete={task && onDelete ? () => onDelete(task) : undefined}
    >
      <Form.Group className="mb-3" controlId="task-title">
        <Form.Label>Título</Form.Label>
        <Form.Control
          autoFocus
          value={values.title}
          onChange={(e) => {
            set('title')(e.target.value)
            setError('')
          }}
          placeholder="Ej.: Resolver la guía de ejercicios"
          isInvalid={!!error}
          maxLength={120}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="task-subject">
        <Form.Label>Materia</Form.Label>
        <SubjectSelect value={values.subjectId} onChange={set('subjectId')} />
      </Form.Group>

      <Row className="g-3">
        <Col sm={6}>
          <Form.Group controlId="task-priority">
            <Form.Label>Prioridad</Form.Label>
            <Form.Select value={values.priority} onChange={(e) => set('priority')(e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.value}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="task-due">
            <Form.Label>Fecha límite</Form.Label>
            <Form.Control type="date" value={values.dueDate ?? ''} onChange={(e) => set('dueDate')(e.target.value)} />
            <Form.Text>Dejala vacía si no tiene fecha.</Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </FormModal>
  )
}
