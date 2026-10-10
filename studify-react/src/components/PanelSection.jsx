import Card from 'react-bootstrap/Card'
import SectionHeader from './SectionHeader'

// tone: 'primary' | 'info' | 'warning' | 'danger'
export default function PanelSection({ id, tone = 'primary', title, subtitle, actionLabel, children }) {
  return (
    <Card
      as="section"
      id={id}
      className={`rounded-4 shadow-sm border-top border-4 border-${tone} mb-4`}
    >
      <Card.Body className="p-4">
        <SectionHeader title={title} subtitle={subtitle} actionLabel={actionLabel} />
        {children}
      </Card.Body>
    </Card>
  )
}
