import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import PanelSection from '../components/PanelSection'
import NoteCard from '../components/NoteCard'
import NoteFormModal from '../components/NoteFormModal'
import SubjectSelect from '../components/SubjectSelect'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showToast } from '../utils/alerts'

export default function Notes() {
  usePageTitle('Mis apuntes | Studify')
  const location = useLocation()
  const navigate = useNavigate()
  const { notes, subjectName, addNote, updateNote, deleteNote } = useData()
  const [params, setParams] = useSearchParams()
  const subjectFilter = params.get('materia') ?? ''
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [editing, setEditing] = useState(null)

  // Si se llega desde el inicio tocando un apunte, se abre directamente
  useEffect(() => {
    const openId = location.state?.openId
    if (!openId) return
    const note = notes.find((n) => n.id === openId)
    if (note) setEditing({ note })
    navigate(location.pathname + location.search, { replace: true, state: null })
  }, [location, navigate, notes])

  const term = search.trim().toLowerCase()
  const visible = notes
    .filter((n) => !subjectFilter || n.subjectId === subjectFilter)
    .filter((n) => !term || n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term))
    .sort((a, b) => (sort === 'az' ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt)))

  const setSubjectFilter = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('materia', id)
    else next.delete('materia')
    setParams(next, { replace: true })
  }

  const handleSave = (values) => {
    if (editing?.note) {
      updateNote(editing.note.id, values)
      showToast('Apunte guardado')
    } else {
      addNote(values)
      showToast('Apunte creado')
    }
  }

  const handleDelete = async (note) => {
    setEditing(null)
    const ok = await confirmAction({ title: '¿Eliminar el apunte?', text: `"${note.title}" se va a borrar.` })
    if (ok) {
      deleteNote(note.id)
      showToast('Apunte eliminado')
    }
  }

  return (
    <>
      <PanelSection
        id="mis-apuntes"
        tone="warning"
        title="Mis apuntes"
        subtitle="Tus resúmenes y materiales, organizados por materia."
        actionLabel="Nuevo apunte"
        actionIcon="bi-plus-lg"
        onAction={() => setEditing({})}
      >
        <Row className="g-2 mb-3">
          <Col md={6}>
            <Form.Control
              type="search"
              placeholder="Buscar en títulos y contenido…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar apuntes"
            />
          </Col>
          <Col sm={7} md={3}>
            <SubjectSelect value={subjectFilter} onChange={setSubjectFilter} allLabel="Todas las materias" ariaLabel="Filtrar por materia" />
          </Col>
          <Col sm={5} md={3}>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar apuntes">
              <option value="recent">Más recientes</option>
              <option value="az">Título (A-Z)</option>
            </Form.Select>
          </Col>
        </Row>

        {visible.length === 0 ? (
          <EmptyState
            icon="bi-journal-text"
            title={notes.length === 0 ? 'Todavía no tenés apuntes' : 'No encontramos apuntes'}
            text={notes.length === 0 ? 'Creá tu primer apunte o guardá artículos desde Wikipedia.' : 'Probá con otra búsqueda o materia.'}
          >
            <Button size="sm" onClick={() => setEditing({})}>
              <i className="bi bi-plus-lg me-1"></i>Nuevo apunte
            </Button>
          </EmptyState>
        ) : (
          <Row className="g-3">
            {visible.map((note) => (
              <Col md={6} xl={4} key={note.id}>
                <NoteCard note={note} subjectName={subjectName(note.subjectId)} onOpen={(n) => setEditing({ note: n })} />
              </Col>
            ))}
          </Row>
        )}
      </PanelSection>

      {editing && (
        <NoteFormModal
          note={editing.note}
          defaults={{ subjectId: subjectFilter }}
          onSave={handleSave}
          onDelete={handleDelete}
          onHide={() => setEditing(null)}
        />
      )}
    </>
  )
}
