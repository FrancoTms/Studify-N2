import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'
import { EVENT_TYPES } from '../data/events'
import { formatDay, parseISODate } from '../utils/dates'
import { daysUntil } from '../utils/stats'

function daysLabel(days) {
  if (days === 0) return 'Es hoy'
  if (days === 1) return 'Mañana'
  if (days > 1) return `Faltan ${days} días`
  return 'Ya pasó'
}

export default function ExamCard({ event, subjectName, tone, onEdit, onDelete }) {
  const type = EVENT_TYPES[event.type] ?? EVENT_TYPES.exam
  const cardTone = tone ?? type.tone
  const days = daysUntil(event.date)
  const darkText = cardTone === 'warning' || cardTone === 'light' ? 'dark' : undefined

  return (
    <Card className={`h-100 rounded-4 shadow-sm border-start border-4 border-${cardTone} hover-lift`}>
      <Card.Body>
        <Stack direction="horizontal" gap={2} className="align-items-start justify-content-between mb-3">
          <ToneIcon icon={`${type.icon} fs-5`} tone={cardTone} />
          <Badge bg={days < 0 ? 'secondary' : cardTone} text={days < 0 ? undefined : darkText}>
            {daysLabel(days)}
          </Badge>
        </Stack>
        <Card.Text className="text-secondary small mb-0">{type.label} · {subjectName}</Card.Text>
        <Card.Title as="h3" className="h6 fw-bold mb-1 text-break">{event.title}</Card.Title>
        <Stack direction="horizontal" className="justify-content-between align-items-center">
          <Card.Text className="small mb-0">
            <i className="bi bi-clock me-1"></i>
            {formatDay(parseISODate(event.date))}
            {event.time && ` · ${event.time} h`}
          </Card.Text>
          {(onEdit || onDelete) && (
            <Stack direction="horizontal" gap={1}>
              {onEdit && (
                <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => onEdit(event)} aria-label={`Editar ${event.title}`} title="Editar">
                  <i className="bi bi-pencil"></i>
                </Button>
              )}
              {onDelete && (
                <Button variant="link" size="sm" className="text-danger p-1" onClick={() => onDelete(event)} aria-label={`Eliminar ${event.title}`} title="Eliminar">
                  <i className="bi bi-trash"></i>
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}
