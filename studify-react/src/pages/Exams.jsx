import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import PanelSection from '../components/PanelSection'
import ExamCard from '../components/ExamCard'
import EventFormModal from '../components/EventFormModal'
import SubjectSelect from '../components/SubjectSelect'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showToast } from '../utils/alerts'
import { todayISO } from '../utils/dates'

const TYPE_FILTERS = [
  { key: 'all', label: 'Todos', types: ['exam', 'task'] },
  { key: 'exam', label: 'Exámenes', types: ['exam'] },
  { key: 'task', label: 'Entregas', types: ['task'] },
]

export default function Exams() {
  usePageTitle('Próximos exámenes | Studify')
  const { events, subjectName, subjectById, addEvent, updateEvent, deleteEvent } = useData()
  const [params, setParams] = useSearchParams()
  const subjectFilter = params.get('materia') ?? ''
  const [typeFilter, setTypeFilter] = useState('all')
  const [showPast, setShowPast] = useState(false)
  const [editing, setEditing] = useState(null)

  const today = todayISO()
  const types = TYPE_FILTERS.find((f) => f.key === typeFilter).types
  const filtered = events
    .filter((e) => types.includes(e.type))
    .filter((e) => !subjectFilter || e.subjectId === subjectFilter)
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  const upcoming = filtered.filter((e) => e.date >= today)
  const past = filtered.filter((e) => e.date < today).reverse()

  const setSubjectFilter = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('materia', id)
    else next.delete('materia')
    setParams(next, { replace: true })
  }

  const handleSave = (values) => {
    if (editing?.event) {
      updateEvent(editing.event.id, values)
      showToast('Evento actualizado')
    } else {
      addEvent(values)
      showToast('Evento agregado')
    }
  }

  const handleDelete = async (event) => {
    setEditing(null)
    const ok = await confirmAction({ title: '¿Eliminar el evento?', text: `"${event.title}" se va a borrar.` })
    if (ok) {
      deleteEvent(event.id)
      showToast('Evento eliminado')
    }
  }

  const renderGrid = (list) => (
    <Row className="g-3">
      {list.map((event) => (
        <Col md={6} xl={4} key={event.id}>
          <ExamCard
            event={event}
            subjectName={subjectName(event.subjectId)}
            tone={event.type === 'exam' ? subjectById[event.subjectId]?.tone : undefined}
            onEdit={(e) => setEditing({ event: e })}
            onDelete={handleDelete}
          />
        </Col>
      ))}
    </Row>
  )

  return (
    <>
      <PanelSection
        id="proximos-examenes"
        tone="danger"
        title="Próximos exámenes"
        subtitle="Parciales, finales y entregas con la cuenta regresiva."
        actionLabel="Agregar"
        actionIcon="bi-plus-lg"
        onAction={() => setEditing({})}
      >
        <Row className="g-2 mb-3 align-items-center">
          <Col md>
            <Nav variant="pills" activeKey={typeFilter} onSelect={(k) => setTypeFilter(k)} className="gap-1">
              {TYPE_FILTERS.map((f) => (
                <Nav.Item key={f.key}>
                  <Nav.Link eventKey={f.key} as="button" className="rounded-pill py-1 px-3 small fw-semibold">
                    {f.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col md={4}>
            <SubjectSelect value={subjectFilter} onChange={setSubjectFilter} allLabel="Todas las materias" size="sm" ariaLabel="Filtrar por materia" />
          </Col>
        </Row>

        {upcoming.length === 0 ? (
          <EmptyState icon="bi-calendar-check" title="No hay fechas próximas" text="Agregá tus parciales y entregas para no olvidarte de ninguna.">
            <Button size="sm" onClick={() => setEditing({})}>
              <i className="bi bi-plus-lg me-1"></i>Agregar examen
            </Button>
          </EmptyState>
        ) : (
          renderGrid(upcoming)
        )}

        {past.length > 0 && (
          <div className="mt-4">
            <Button variant="link" className="p-0 fw-semibold" onClick={() => setShowPast(!showPast)} aria-expanded={showPast}>
              <i className={`bi ${showPast ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
              {showPast ? 'Ocultar' : 'Ver'} fechas pasadas ({past.length})
            </Button>
            {showPast && <div className="mt-3">{renderGrid(past)}</div>}
          </div>
        )}
      </PanelSection>

      {editing && (
        <EventFormModal
          event={editing.event}
          defaults={{ subjectId: subjectFilter, type: typeFilter === 'task' ? 'task' : 'exam' }}
          onSave={handleSave}
          onDelete={handleDelete}
          onHide={() => setEditing(null)}
        />
      )}
    </>
  )
}
