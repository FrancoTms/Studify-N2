import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useData } from '../context/contexts'

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

// Elige dónde guardar un archivo: unidad y (opcional) tema de esa unidad
export default function UnitTopicSelect({ subjectId, unitId, topicId, onChange, idPrefix = 'location' }) {
  const { units, topics } = useData()
  const subjectUnits = units.filter((u) => u.subjectId === subjectId).sort(byOrder)
  const unitTopics = topics.filter((t) => t.unitId === unitId)

  return (
    <Row className="g-3">
      <Col sm={6}>
        <Form.Group controlId={`${idPrefix}-unit`}>
          <Form.Label>Unidad</Form.Label>
          <Form.Select value={unitId ?? ''} onChange={(e) => onChange({ unitId: e.target.value || null, topicId: null })}>
            <option value="">Sin unidad</option>
            {subjectUnits.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId={`${idPrefix}-topic`}>
          <Form.Label>Tema</Form.Label>
          <Form.Select
            value={topicId ?? ''}
            onChange={(e) => onChange({ unitId, topicId: e.target.value || null })}
            disabled={!unitId || unitTopics.length === 0}
          >
            <option value="">{unitId ? 'General de la unidad' : '—'}</option>
            {unitTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}
