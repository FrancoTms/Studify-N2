import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'

export default function TechniqueCard({ icon, title, description, duration, tone = 'success', onSelect }) {
  return (
    <Card className={`h-100 rounded-4 shadow-sm border-top border-4 border-${tone} hover-lift`}>
      <Card.Body className="d-flex flex-column">
        <ToneIcon icon={`${icon} fs-5`} tone={tone} />
        <Card.Title as="h3" className="h6 fw-bold mt-3 mb-1">{title}</Card.Title>
        <Card.Text className="text-secondary small mb-3 flex-grow-1">{description}</Card.Text>
        <Stack direction="horizontal" className="justify-content-between align-items-center">
          <Badge bg="warning-subtle" text="warning-emphasis">
            <i className="bi bi-stopwatch me-1"></i>{duration}
          </Badge>
          {onSelect && (
            <Button variant="link" size="sm" className="p-0 fw-semibold" onClick={onSelect}>
              Ver pasos <i className="bi bi-arrow-right"></i>
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}
