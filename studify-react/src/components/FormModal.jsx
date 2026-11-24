import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

// Ventana con un formulario. Se usa para crear y editar materias, tareas, apuntes y eventos.
export default function FormModal({
  title,
  onHide,
  onSubmit,
  submitLabel = 'Guardar',
  size,
  onDelete,
  children,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Modal show onHide={onHide} centered size={size}>
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5 fw-bold">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          {onDelete && (
            <Button variant="outline-danger" className="me-auto" onClick={onDelete}>
              <i className="bi bi-trash me-1"></i>
              Eliminar
            </Button>
          )}
          <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary">{submitLabel}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
