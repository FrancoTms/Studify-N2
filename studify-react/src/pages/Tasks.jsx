import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PanelSection from '../components/PanelSection'
import TaskItem from '../components/TaskItem'
import TaskFormModal from '../components/TaskFormModal'
import SubjectSelect from '../components/SubjectSelect'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showToast } from '../utils/alerts'
import { sortTasks, todayTasks } from '../utils/stats'

const FILTERS = [
  { key: 'today', label: 'Hoy' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'done', label: 'Completadas' },
  { key: 'all', label: 'Todas' },
]

export default function Tasks() {
  usePageTitle('Plan de hoy | Studify')
  const { tasks, subjectName, addTask, updateTask, deleteTask, toggleTask, clearCompletedTasks } = useData()
  const [params, setParams] = useSearchParams()
  const subjectFilter = params.get('materia') ?? ''
  const [filter, setFilter] = useState(subjectFilter ? 'all' : 'today')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null = cerrado, { task } = editar, {} = nueva

  const bySubject = subjectFilter ? tasks.filter((t) => t.subjectId === subjectFilter) : tasks
  const lists = {
    today: todayTasks(bySubject),
    pending: bySubject.filter((t) => !t.completed).sort(sortTasks),
    done: bySubject.filter((t) => t.completed).sort(sortTasks),
    all: [...bySubject].sort(sortTasks),
  }
  const term = search.trim().toLowerCase()
  const visible = lists[filter].filter((t) => !term || t.title.toLowerCase().includes(term))
  const completedCount = tasks.filter((t) => t.completed).length

  const setSubjectFilter = (id) => {
    const next = new URLSearchParams(params)
    if (id) next.set('materia', id)
    else next.delete('materia')
    setParams(next, { replace: true })
  }

  const handleSave = (values) => {
    if (editing?.task) {
      updateTask(editing.task.id, values)
      showToast('Tarea actualizada')
    } else {
      addTask(values)
      showToast('Tarea creada')
    }
  }

  const handleDelete = async (task) => {
    setEditing(null)
    const ok = await confirmAction({ title: '¿Eliminar la tarea?', text: `"${task.title}" se va a borrar.` })
    if (ok) {
      deleteTask(task.id)
      showToast('Tarea eliminada')
    }
  }

  const handleClearCompleted = async () => {
    const ok = await confirmAction({
      title: '¿Borrar las tareas completadas?',
      text: `Se van a eliminar ${completedCount} tareas completadas.`,
    })
    if (ok) clearCompletedTasks()
  }

  return (
    <>
      <PanelSection
        id="plan-de-hoy"
        tone="primary"
        title="Plan de hoy"
        subtitle="Creá, organizá y completá tus tareas."
        actionLabel="Nueva tarea"
        actionIcon="bi-plus-lg"
        onAction={() => setEditing({})}
      >
        <Row className="g-2 mb-3 align-items-center">
          <Col lg="auto">
            <Nav variant="pills" activeKey={filter} onSelect={(k) => setFilter(k)} className="gap-1">
              {FILTERS.map((f) => (
                <Nav.Item key={f.key}>
                  <Nav.Link eventKey={f.key} as="button" className="rounded-pill py-1 px-3 small fw-semibold">
                    {f.label}{' '}
                    <Badge bg={filter === f.key ? 'light' : 'secondary'} text={filter === f.key ? 'dark' : undefined} pill>
                      {lists[f.key].length}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col sm={6} lg>
            <Form.Control
              type="search"
              size="sm"
              placeholder="Buscar tarea…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar tarea"
            />
          </Col>
          <Col sm={6} lg={3}>
            <SubjectSelect value={subjectFilter} onChange={setSubjectFilter} allLabel="Todas las materias" size="sm" ariaLabel="Filtrar por materia" />
          </Col>
        </Row>

        {visible.length === 0 ? (
          <EmptyState
            icon="bi-check2-circle"
            title={tasks.length === 0 ? 'Todavía no tenés tareas' : 'No hay tareas en esta vista'}
            text={filter === 'today' ? 'No hay tareas que venzan hoy. ¡Buen momento para adelantar!' : undefined}
          >
            <Button size="sm" onClick={() => setEditing({})}>
              <i className="bi bi-plus-lg me-1"></i>Nueva tarea
            </Button>
          </EmptyState>
        ) : (
          <Stack gap={2}>
            {visible.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subjectName={subjectName(task.subjectId)}
                onToggle={toggleTask}
                onEdit={(t) => setEditing({ task: t })}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        )}

        {completedCount > 0 && (
          <div className="text-end mt-3">
            <Button variant="link" size="sm" className="text-danger" onClick={handleClearCompleted}>
              <i className="bi bi-trash me-1"></i>
              Borrar completadas ({completedCount})
            </Button>
          </div>
        )}
      </PanelSection>

      {editing && (
        <TaskFormModal
          task={editing.task}
          defaults={{ subjectId: subjectFilter }}
          onSave={handleSave}
          onDelete={handleDelete}
          onHide={() => setEditing(null)}
        />
      )}
    </>
  )
}
