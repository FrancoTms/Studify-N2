import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import { PRIORITIES } from '../data/catalog'
import { formatDue, todayISO } from '../utils/dates'

const priorityTone = (priority) => PRIORITIES.find((p) => p.value === priority)?.tone ?? 'primary'

export default function TaskItem({ task, subjectName, onToggle, onEdit, onDelete }) {
  const { id, title, priority, dueDate, completed } = task
  const tone = priorityTone(priority)
  const overdue = !completed && dueDate && dueDate < todayISO()
  const checkId = `task-${id}`

  return (
    <Stack direction="horizontal" gap={3} className="p-3 rounded-3 border bg-body">
      <Form.Check.Input
        id={checkId}
        type="checkbox"
        className="m-0 flex-shrink-0"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={completed ? `Marcar "${title}" como pendiente` : `Completar "${title}"`}
      />
      <label htmlFor={checkId} className={`flex-grow-1 ${completed ? 'opacity-50' : ''}`} style={{ cursor: 'pointer', minWidth: 0 }}>
        <span className={`d-block fw-semibold text-break ${completed ? 'text-decoration-line-through' : ''}`}>
          {title}
        </span>
        <span className="d-block text-secondary small">
          {subjectName}
          {dueDate && (
            <span className={overdue ? 'text-danger fw-semibold' : ''}>
              {' · '}
              <i className="bi bi-clock me-1"></i>
              {formatDue(dueDate)}
            </span>
          )}
        </span>
      </label>
      <Badge bg={`${tone}-subtle`} text={tone === 'secondary' ? 'secondary' : tone} className="flex-shrink-0">
        {priority}
      </Badge>
      {(onEdit || onDelete) && (
        <Stack direction="horizontal" gap={1} className="flex-shrink-0">
          {onEdit && (
            <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => onEdit(task)} aria-label={`Editar "${title}"`} title="Editar">
              <i className="bi bi-pencil"></i>
            </Button>
          )}
          {onDelete && (
            <Button variant="link" size="sm" className="text-danger p-1" onClick={() => onDelete(task)} aria-label={`Eliminar "${title}"`} title="Eliminar">
              <i className="bi bi-trash"></i>
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  )
}
