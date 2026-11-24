import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormModal from './FormModal'
import UnitTopicSelect from './UnitTopicSelect'
import { splitName } from '../utils/files'

// Renombrar un archivo o moverlo a otra unidad o tema (la extensión no se toca)
export default function FileEditModal({ file, onSave, onDelete, onHide }) {
  const { base, ext } = splitName(file.name)
  const [name, setName] = useState(base)
  const [location, setLocation] = useState({ unitId: file.unitId, topicId: file.topicId })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const clean = name.trim()
    if (!clean) {
      setError('El archivo necesita un nombre.')
      return
    }
    onSave({ name: `${clean}${ext}`, unitId: location.unitId, topicId: location.topicId })
    onHide()
  }

  return (
    <FormModal title="Editar archivo" submitLabel="Guardar cambios" onHide={onHide} onSubmit={handleSubmit} onDelete={() => onDelete(file)}>
      <Form.Group className="mb-3" controlId="file-name">
        <Form.Label>Nombre</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            isInvalid={!!error}
            maxLength={150}
          />
          {ext && <InputGroup.Text>{ext}</InputGroup.Text>}
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <UnitTopicSelect subjectId={file.subjectId} {...location} onChange={setLocation} idPrefix="file-edit" />
    </FormModal>
  )
}
