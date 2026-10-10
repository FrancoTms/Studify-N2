import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import ToneIcon from './ToneIcon'

export default function NoteCard({ title, subject, date }) {
  return (
    <Card className="h-100 rounded-4 shadow-sm hover-lift">
      <Card.Body className="d-flex gap-3">
        <ToneIcon icon="bi-journal-text fs-5" tone="danger" />
        <div>
          <Card.Title as="h3" className="h6 fw-bold mb-1">{title}</Card.Title>
          <Badge bg="primary-subtle" text="primary" className="mb-2">{subject}</Badge>
          <Card.Text className="text-secondary small mb-0">{date}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}