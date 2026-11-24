import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'

// progress = { percent, done, total, nextTask } calculado con subjectProgress()
export default function SubjectCard({ subject, progress, counts, onEdit, onDelete }) {
  const { id, icon, name, teacher, tone = 'primary' } = subject
  const { percent, done, total, nextTask } = progress

  return (
    <Card className="h-100 rounded-4 shadow-sm hover-lift">
      <Card.Body className="d-flex flex-column">
        <Stack direction="horizontal" gap={3} className="mb-3 align-items-start">
          <ToneIcon icon={`${icon} fs-5`} tone={tone} />
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <Card.Title as="h3" className="h6 fw-bold mb-0 text-break">{name}</Card.Title>
            {teacher && <Card.Text className="text-secondary small mb-0">{teacher}</Card.Text>}
          </div>
          {(onEdit || onDelete) && (
            <Stack direction="horizontal" gap={1}>
              {onEdit && (
                <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => onEdit(subject)} aria-label={`Editar ${name}`} title="Editar">
                  <i className="bi bi-pencil"></i>
                </Button>
              )}
              {onDelete && (
                <Button variant="link" size="sm" className="text-danger p-1" onClick={() => onDelete(subject)} aria-label={`Eliminar ${name}`} title="Eliminar">
                  <i className="bi bi-trash"></i>
                </Button>
              )}
            </Stack>
          )}
        </Stack>

        <Stack direction="horizontal" className="justify-content-between small fw-semibold mb-1">
          <span>Progreso</span>
          <span>{percent}%</span>
        </Stack>
        <ProgressBar
          now={percent}
          variant={tone}
          aria-label={`Progreso en ${name}`}
          className="mb-2"
          style={{ height: 8 }}
        />
        <Card.Text className="text-secondary small mb-2">
          {total === 0 ? 'Todavía no hay tareas' : `${done} de ${total} tareas completadas`}
        </Card.Text>
        <Card.Text className="small mb-0">
          <i className="bi bi-flag me-1"></i>
          {nextTask ? nextTask.title : 'Sin tareas pendientes'}
        </Card.Text>

        {counts && (
          <Stack direction="horizontal" gap={2} className="flex-wrap mt-3 pt-3 border-top mt-auto">
            <Button as={Link} to={`/tareas?materia=${id}`} variant="outline-primary" size="sm" className="rounded-pill">
              <i className="bi bi-check2-square me-1"></i>{counts.tasks} tareas
            </Button>
            <Button as={Link} to={`/apuntes?materia=${id}`} variant="outline-primary" size="sm" className="rounded-pill">
              <i className="bi bi-journal-text me-1"></i>{counts.notes} apuntes
            </Button>
            <Button as={Link} to={`/examenes?materia=${id}`} variant="outline-primary" size="sm" className="rounded-pill">
              <i className="bi bi-calendar-event me-1"></i>{counts.exams} exámenes
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}
