
import Card from 'react-bootstrap/Card'
import ToneIcon from './ToneIcon'

export default function StatCard({
  icon,
  title,
  value,
  description,
  tone = 'primary'
}) {
  return (
  <Card
  className={`
    h-100 rounded-4
    border border-1 border-${tone}
    bg-${tone}-subtle
    shadow-sm hover-lift
  `}
>
      <Card.Body className="d-flex align-items-center gap-3 p-4">
        <ToneIcon
          icon={`${icon} fs-4`}
          tone={tone}
          size={52}
        />

        <div>
          <Card.Text className="text-body-secondary small mb-1">
            {title}
          </Card.Text>

          <Card.Text className="h4 fw-bold mb-1">
            {value}
          </Card.Text>

          <Card.Text className="text-body-secondary small mb-0">
            {description}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}
