import Card from 'react-bootstrap/Card'
import ToneIcon from './ToneIcon'

export default function StatCard({ icon, title, value, description, tone = 'primary' }) {
  return (
    <Card className={`h-100 rounded-4 shadow-sm border-top border-4 border-${tone} hover-lift`}>
      <Card.Body className="d-flex align-items-center gap-3">
        <ToneIcon icon={`${icon} fs-4`} tone={tone} size={52} />
        <div>
          <Card.Text className="text-secondary small mb-0">{title}</Card.Text>
          <Card.Text className="h4 fw-bold mb-0">{value}</Card.Text>
          <Card.Text className="text-secondary small mb-0">{description}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}