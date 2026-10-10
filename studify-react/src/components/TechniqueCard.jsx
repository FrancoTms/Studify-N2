import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import ToneIcon from './ToneIcon'

export default function TechniqueCard({ icon, title, description, duration, tone = 'success' }) {
  return (
    <Card className={`h-100 rounded-4 shadow-sm border-top border-4 border-${tone} hover-lift`}>
      <Card.Body>
        <ToneIcon icon={`${icon} fs-5`} tone={tone} />
        <Card.Title as="h3" className="h6 fw-bold mt-3 mb-1">{title}</Card.Title>
        <Card.Text className="text-secondary small mb-3">{description}</Card.Text>
        <Badge bg="warning-subtle" text="warning-emphasis">
          <i className="bi bi-stopwatch me-1"></i>{duration}
        </Badge>
      </Card.Body>
    </Card>
  )
}