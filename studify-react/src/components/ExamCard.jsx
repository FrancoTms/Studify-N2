import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'

export default function ExamCard({ subject, title, date, daysLeft, tone = 'primary' }) {
  const darkText = tone === 'warning' || tone === 'light' ? 'dark' : undefined

  return (
    <Card className={`h-100 rounded-4 shadow-sm border-start border-4 border-${tone} hover-lift`}>
      <Card.Body>
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-start justify-content-between mb-3"
        >
          <ToneIcon icon="bi-calendar-event fs-5" tone={tone} />
          <Badge bg={tone} text={darkText}>
            {daysLeft === 1 ? 'Falta 1 día' : `Faltan ${daysLeft} días`}
          </Badge>
        </Stack>
        <Card.Text className="text-secondary small mb-0">{subject}</Card.Text>
        <Card.Title as="h3" className="h6 fw-bold mb-1">{title}</Card.Title>
        <Card.Text className="small mb-0">
          <i className="bi bi-clock me-1"></i>{date}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}