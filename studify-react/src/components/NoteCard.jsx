import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import ToneIcon from './ToneIcon'
import { formatRelative } from '../utils/dates'

export default function NoteCard({ note, subjectName, onOpen }) {
  const { title, content, updatedAt } = note

  return (
    <Card className="h-100 rounded-4 shadow-sm hover-lift">
      <Card.Body className="d-flex gap-3">
        <ToneIcon icon="bi-journal-text fs-5" tone="danger" />
        <div style={{ minWidth: 0 }}>
          <Card.Title as="h3" className="h6 fw-bold mb-1 text-break">
            {/* stretched-link hace que toda la tarjeta se pueda tocar */}
            <button
              type="button"
              className="btn btn-link p-0 text-reset text-decoration-none fw-bold text-start stretched-link"
              onClick={() => onOpen(note)}
            >
              {title}
            </button>
          </Card.Title>
          <Badge bg="primary-subtle" text="primary" className="mb-2">{subjectName}</Badge>
          {content && <Card.Text className="text-secondary small mb-1 text-clamp-2">{content}</Card.Text>}
          <Card.Text className="text-secondary small mb-0">Actualizado {formatRelative(updatedAt)}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}
