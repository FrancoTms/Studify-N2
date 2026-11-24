import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PanelSection from '../components/PanelSection'
import SubjectCard from '../components/SubjectCard'
import SubjectFormModal from '../components/SubjectFormModal'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showToast } from '../utils/alerts'
import { subjectProgress } from '../utils/stats'

export default function Subjects() {
  usePageTitle('Mis materias | Studify')
  const location = useLocation()
  const navigate = useNavigate()
  const { subjects, tasks, notes, events, addSubject, updateSubject, deleteSubject } = useData()
  const [editing, setEditing] = useState(null)

  // Desde el inicio se puede llegar con la orden de abrir el formulario
  useEffect(() => {
    if (location.state?.create) {
      setEditing({})
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate])

  const countsFor = (id) => ({
    tasks: tasks.filter((t) => t.subjectId === id).length,
    notes: notes.filter((n) => n.subjectId === id).length,
    exams: events.filter((e) => e.subjectId === id && e.type === 'exam').length,
  })

  const handleSave = (values) => {
    if (editing?.subject) {
      updateSubject(editing.subject.id, values)
      showToast('Materia actualizada')
    } else {
      addSubject(values)
      showToast('Materia creada')
    }
  }

  const handleDelete = async (subject) => {
    setEditing(null)
    const ok = await confirmAction({
      title: `¿Eliminar ${subject.name}?`,
      text: 'Sus tareas, apuntes y exámenes no se borran: quedan como "Sin materia".',
    })
    if (ok) {
      deleteSubject(subject.id)
      showToast('Materia eliminada')
    }
  }

  return (
    <>
      <PanelSection
        id="materias"
        tone="info"
        title="Mis materias"
        subtitle="El progreso se calcula con las tareas completadas de cada materia."
        actionLabel="Nueva materia"
        actionIcon="bi-plus-lg"
        onAction={() => setEditing({})}
      >
        {subjects.length === 0 ? (
          <EmptyState icon="bi-book" title="Todavía no tenés materias" text="Creá una materia por cada asignatura que estés cursando.">
            <Button size="sm" onClick={() => setEditing({})}>
              <i className="bi bi-plus-lg me-1"></i>Nueva materia
            </Button>
          </EmptyState>
        ) : (
          <Row className="g-3">
            {subjects.map((subject) => (
              <Col md={6} xl={4} key={subject.id}>
                <SubjectCard
                  subject={subject}
                  progress={subjectProgress(subject.id, tasks)}
                  counts={countsFor(subject.id)}
                  onEdit={(s) => setEditing({ subject: s })}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        )}
      </PanelSection>

      {editing && (
        <SubjectFormModal
          subject={editing.subject}
          existingNames={subjects.map((s) => s.name)}
          onSave={handleSave}
          onDelete={handleDelete}
          onHide={() => setEditing(null)}
        />
      )}
    </>
  )
}
