import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import FormModal from './FormModal'
import ToneIcon from './ToneIcon'
import { SUBJECT_ICONS, TONES } from '../data/catalog'

export default function SubjectFormModal({ subject, existingNames = [], onSave, onDelete, onHide }) {
  const [values, setValues] = useState(() => ({
    name: subject?.name ?? '',
    teacher: subject?.teacher ?? '',
    icon: subject?.icon ?? 'bi-book',
    tone: subject?.tone ?? 'primary',
  }))
  const [error, setError] = useState('')

  const set = (field, value) => setValues((v) => ({ ...v, [field]: value }))

  const handleSubmit = () => {
    const name = values.name.trim()
    if (name.length < 2) {
      setError('Escribí el nombre de la materia.')
      return
    }
    const repeated = existingNames.some(
      (n) => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== subject?.name.toLowerCase(),
    )
    if (repeated) {
      setError('Ya tenés una materia con ese nombre.')
      return
    }
    onSave({ ...values, name, teacher: values.teacher.trim() })
    onHide()
  }

  return (
    <FormModal
      title={subject ? 'Editar materia' : 'Nueva materia'}
      submitLabel={subject ? 'Guardar cambios' : 'Crear materia'}
      onHide={onHide}
      onSubmit={handleSubmit}
      onDelete={subject && onDelete ? () => onDelete(subject) : undefined}
    >
      <Form.Group className="mb-3" controlId="subject-name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          autoFocus
          value={values.name}
          onChange={(e) => {
            set('name', e.target.value)
            setError('')
          }}
          placeholder="Ej.: Base de Datos"
          isInvalid={!!error}
          maxLength={60}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="subject-teacher">
        <Form.Label>Descripción o docente <span className="text-secondary">(opcional)</span></Form.Label>
        <Form.Control
          value={values.teacher}
          onChange={(e) => set('teacher', e.target.value)}
          placeholder="Ej.: Prof. Gómez · Martes y jueves"
          maxLength={80}
        />
      </Form.Group>

      <fieldset className="mb-3">
        <legend className="form-label fs-6">Ícono</legend>
        <Stack direction="horizontal" gap={2} className="flex-wrap">
          {SUBJECT_ICONS.map((icon) => (
            <Button
              key={icon.value}
              variant={values.icon === icon.value ? 'primary' : 'outline-secondary'}
              className="lh-1 p-2"
              onClick={() => set('icon', icon.value)}
              aria-pressed={values.icon === icon.value}
              aria-label={icon.label}
              title={icon.label}
            >
              <i className={`bi ${icon.value} fs-5`}></i>
            </Button>
          ))}
        </Stack>
      </fieldset>

      <fieldset>
        <legend className="form-label fs-6">Color</legend>
        <Stack direction="horizontal" gap={2} className="flex-wrap align-items-center">
          {TONES.map((tone) => (
            <Form.Check
              key={tone.value}
              inline
              type="radio"
              id={`subject-tone-${tone.value}`}
              name="subject-tone"
              label={tone.label}
              checked={values.tone === tone.value}
              onChange={() => set('tone', tone.value)}
            />
          ))}
          <span className="ms-auto">
            <ToneIcon icon={`${values.icon} fs-5`} tone={values.tone} />
          </span>
        </Stack>
      </fieldset>
    </FormModal>
  )
}
