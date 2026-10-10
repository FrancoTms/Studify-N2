import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'

export default function SubjectCard({ icon, name, teacher, progress, nextTask, tone = 'primary' }) {
  return (
    <Card className="h-100 rounded-4 shadow-sm hover-lift">
      <Card.Body>
        <Stack direction="horizontal" gap={3} className="mb-3">
          <ToneIcon icon={`${icon} fs-5`} tone={tone} />
          <div>
            <Card.Title as="h3" className="h6 fw-bold mb-0">{name}</Card.Title>
            <Card.Text className="text-secondary small mb-0">{teacher}</Card.Text>
          </div>
        </Stack>

        <Stack direction="horizontal" className="justify-content-between small fw-semibold mb-1">
          <span>Progreso</span>
          <span>{progress}%</span>
        </Stack>
        <ProgressBar
          now={progress}
          variant={tone}
          aria-label={`Progreso en ${name}`}
          className="mb-3"
          style={{ height: 8 }}
        />
        <Card.Text className="small mb-0">
          <i className="bi bi-flag me-1"></i>{nextTask}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}