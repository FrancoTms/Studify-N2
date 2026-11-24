import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import PanelSection from '../components/PanelSection'
import EmptyState from '../components/EmptyState'
import FileItem from '../components/FileItem'
import FileUploadModal from '../components/FileUploadModal'
import FileEditModal from '../components/FileEditModal'
import FilePreviewModal from '../components/FilePreviewModal'
import NameFormModal from '../components/NameFormModal'
import ToneIcon from '../components/ToneIcon'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showError, showToast } from '../utils/alerts'
import { downloadBlob, formatBytes } from '../utils/files'
import { subjectProgress } from '../utils/stats'

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)
const byName = (a, b) => a.name.localeCompare(b.name, 'es', { numeric: true })
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// Botón chico con ícono para las acciones de unidades y temas
function IconButton({ icon, label, onClick, danger, disabled }) {
  return (
    <Button
      variant="link"
      size="sm"
      className={`p-1 ${danger ? 'text-danger' : 'text-secondary'}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      <i className={`bi ${icon}`}></i>
    </Button>
  )
}

function FileList({ files, empty, actions }) {
  if (!files.length) return empty ? <p className="text-secondary small mb-0 ps-1">{empty}</p> : null
  return (
    <Stack gap={2}>
      {files.map((f) => (
        <FileItem key={f.id} file={f} {...actions} />
      ))}
    </Stack>
  )
}

export default function SubjectDetail() {
  const { subjectId } = useParams()
  const data = useData()
  const { subjectById, units, topics, files, tasks, notes, events } = data
  const subject = subjectById[subjectId]
  usePageTitle(`${subject?.name ?? 'Materia'} | Studify`)

  const [modal, setModal] = useState(null)
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [search, setSearch] = useState('')

  if (!subject) {
    return (
      <EmptyState icon="bi-book" title="No encontramos esa materia" text="Puede que se haya eliminado.">
        <Button as={Link} to="/materias" size="sm">Volver a Mis materias</Button>
      </EmptyState>
    )
  }

  const subjectUnits = units.filter((u) => u.subjectId === subjectId).sort(byOrder)
  const subjectFiles = files.filter((f) => f.subjectId === subjectId).sort(byName)
  const unitById = Object.fromEntries(subjectUnits.map((u) => [u.id, u]))
  const topicById = Object.fromEntries(topics.map((t) => [t.id, t]))
  const topicsOf = (unitId) => topics.filter((t) => t.unitId === unitId).sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  const filesOf = (unitId, topicId = null) => subjectFiles.filter((f) => f.unitId === unitId && (f.topicId ?? null) === topicId)
  const countInUnit = (unitId) => subjectFiles.filter((f) => f.unitId === unitId).length
  const totalBytes = subjectFiles.reduce((sum, f) => sum + f.size, 0)
  const looseFiles = subjectFiles.filter((f) => !f.unitId || !unitById[f.unitId])
  const progress = subjectProgress(subjectId, tasks)

  const locationLabel = (file) => {
    const unit = unitById[file.unitId]
    if (!unit) return 'Sin unidad'
    const topic = topicById[file.topicId]
    return topic ? `${unit.name} › ${topic.name}` : unit.name
  }

  const term = search.trim().toLowerCase()
  const searchResults = term ? subjectFiles.filter((f) => f.name.toLowerCase().includes(term)) : []

  const toggle = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // ----- Acciones -----

  const handleUpload = async ({ unitId, topicId, files: list }) => {
    const { added, rejected } = await data.uploadFiles({ subjectId, unitId, topicId, files: list })
    if (added.length) showToast(added.length === 1 ? 'Archivo subido' : `${added.length} archivos subidos`)
    if (rejected.length) {
      showError(rejected.map((r) => `${r.name}: ${r.reason}`).join(' · '), 'Algunos archivos no se subieron')
    }
  }

  const handleDownload = async (file) => {
    try {
      const blob = await data.getFileBlob(file.id)
      if (!blob) throw new Error('missing')
      downloadBlob(blob, file.name)
    } catch {
      showError('No encontramos el contenido de este archivo en el navegador.', 'No se pudo descargar')
    }
  }

  const handleDeleteFile = async (file) => {
    setModal(null)
    const ok = await confirmAction({ title: '¿Eliminar el archivo?', text: `"${file.name}" se va a borrar de Studify.` })
    if (ok) {
      await data.deleteFile(file.id)
      showToast('Archivo eliminado')
    }
  }

  const handleDeleteUnit = async (unit) => {
    const fileCount = countInUnit(unit.id)
    const topicCount = topicsOf(unit.id).length
    const contents = [topicCount && plural(topicCount, 'tema', 'temas'), fileCount && plural(fileCount, 'archivo', 'archivos')].filter(Boolean)
    const ok = await confirmAction({
      title: `¿Eliminar "${unit.name}"?`,
      text: contents.length ? `También se van a borrar ${contents.join(' y ')}.` : 'La unidad está vacía.',
    })
    if (ok) {
      await data.deleteUnit(unit.id)
      showToast('Unidad eliminada')
    }
  }

  const handleDeleteTopic = async (topic) => {
    const fileCount = filesOf(topic.unitId, topic.id).length
    const ok = await confirmAction({
      title: `¿Eliminar el tema "${topic.name}"?`,
      text: fileCount ? `También se van a borrar ${plural(fileCount, 'archivo', 'archivos')}.` : 'El tema está vacío.',
    })
    if (ok) {
      await data.deleteTopic(topic.id)
      showToast('Tema eliminado')
    }
  }

  const fileActions = {
    onOpen: (file) => setModal({ type: 'preview', file }),
    onDownload: handleDownload,
    onEdit: (file) => setModal({ type: 'editFile', file }),
    onDelete: handleDeleteFile,
  }

  const openUpload = (unitId = null, topicId = null) => setModal({ type: 'upload', defaults: { unitId, topicId } })

  // ----- Vista -----

  return (
    <>
      <Link to="/materias" className="d-inline-block mb-3 small fw-semibold text-decoration-none">
        <i className="bi bi-arrow-left me-1"></i>Mis materias
      </Link>

      <PanelSection
        id="materia-detalle"
        tone={subject.tone}
        title={
          <span className="d-inline-flex align-items-center gap-2">
            <ToneIcon icon={`${subject.icon} fs-5`} tone={subject.tone} />
            {subject.name}
          </span>
        }
        subtitle={subject.teacher}
        actionLabel="Subir archivos"
        actionIcon="bi-cloud-arrow-up"
        onAction={() => openUpload()}
        headerExtra={
          <Button variant="primary" size="sm" className="fw-bold" onClick={() => setModal({ type: 'unit' })}>
            <i className="bi bi-folder-plus me-1"></i>Nueva unidad
          </Button>
        }
      >
        {/* Resumen de la materia */}
        <Stack direction="horizontal" gap={3} className="flex-wrap align-items-center mb-4">
          <div style={{ minWidth: 180 }} className="flex-grow-1">
            <Stack direction="horizontal" className="justify-content-between small fw-semibold mb-1">
              <span>Progreso de tareas</span>
              <span>{progress.percent}%</span>
            </Stack>
            <ProgressBar now={progress.percent} variant={subject.tone} style={{ height: 8 }} aria-label="Progreso de la materia" />
          </div>
          <Badge bg="secondary-subtle" text="secondary" className="py-2 px-3">
            <i className="bi bi-files me-1"></i>
            {plural(subjectFiles.length, 'archivo', 'archivos')} · {formatBytes(totalBytes)}
          </Badge>
          <Button as={Link} to={`/tareas?materia=${subjectId}`} variant="outline-primary" size="sm" className="rounded-pill">
            <i className="bi bi-check2-square me-1"></i>{tasks.filter((t) => t.subjectId === subjectId).length} tareas
          </Button>
          <Button as={Link} to={`/apuntes?materia=${subjectId}`} variant="outline-primary" size="sm" className="rounded-pill">
            <i className="bi bi-journal-text me-1"></i>{notes.filter((n) => n.subjectId === subjectId).length} apuntes
          </Button>
          <Button as={Link} to={`/examenes?materia=${subjectId}`} variant="outline-primary" size="sm" className="rounded-pill">
            <i className="bi bi-calendar-event me-1"></i>{events.filter((e) => e.subjectId === subjectId && e.type === 'exam').length} exámenes
          </Button>
        </Stack>

        {subjectFiles.length > 0 && (
          <InputGroup className="mb-3">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar archivos en esta materia…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar archivos"
            />
          </InputGroup>
        )}

        {term ? (
          // Resultados de búsqueda: lista plana con la ubicación de cada archivo
          <>
            <p className="small text-secondary">
              {searchResults.length ? `${plural(searchResults.length, 'resultado', 'resultados')} para "${search.trim()}"` : `No hay archivos que coincidan con "${search.trim()}".`}
            </p>
            <Stack gap={2}>
              {searchResults.map((f) => (
                <FileItem key={f.id} file={f} location={locationLabel(f)} {...fileActions} />
              ))}
            </Stack>
          </>
        ) : subjectUnits.length === 0 && subjectFiles.length === 0 ? (
          <EmptyState
            icon="bi-folder2-open"
            title="Organizá tu material por unidades"
            text="Creá las unidades de la materia (y temas dentro de cada una) y subí tus PDF, Word, presentaciones y más."
          >
            <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
              <Button size="sm" onClick={() => setModal({ type: 'unit' })}>
                <i className="bi bi-folder-plus me-1"></i>Nueva unidad
              </Button>
              <Button size="sm" variant="outline-primary" onClick={() => openUpload()}>
                <i className="bi bi-cloud-arrow-up me-1"></i>Subir archivos
              </Button>
            </Stack>
          </EmptyState>
        ) : (
          <Stack gap={3}>
            {subjectUnits.map((unit, index) => {
              const open = !collapsed.has(unit.id)
              const unitTopics = topicsOf(unit.id)
              const unitFiles = filesOf(unit.id)
              const total = countInUnit(unit.id)
              const bodyId = `unit-body-${unit.id}`
              return (
                <section key={unit.id} className="border rounded-4 overflow-hidden" aria-label={unit.name}>
                  <Stack direction="horizontal" gap={2} className="bg-body-tertiary px-3 py-2 flex-wrap">
                    <Button
                      variant="link"
                      className="text-reset text-decoration-none fw-bold p-0 d-flex align-items-center gap-2 text-start flex-grow-1"
                      onClick={() => toggle(unit.id)}
                      aria-expanded={open}
                      aria-controls={bodyId}
                      style={{ minWidth: 0 }}
                    >
                      <i className={`bi ${open ? 'bi-chevron-down' : 'bi-chevron-right'} small`}></i>
                      <i className={`bi ${open ? 'bi-folder2-open' : 'bi-folder2'} text-${subject.tone}`}></i>
                      <span className="text-break">{unit.name}</span>
                      <Badge bg="secondary" pill className="fw-normal">{total}</Badge>
                    </Button>
                    <Stack direction="horizontal" gap={0} className="flex-wrap">
                      <IconButton icon="bi-cloud-arrow-up" label={`Subir archivos a ${unit.name}`} onClick={() => openUpload(unit.id)} />
                      <IconButton icon="bi-bookmark-plus" label={`Nuevo tema en ${unit.name}`} onClick={() => setModal({ type: 'topic', unitId: unit.id })} />
                      <IconButton icon="bi-arrow-up" label={`Subir posición de ${unit.name}`} onClick={() => data.moveUnit(unit.id, -1)} disabled={index === 0} />
                      <IconButton icon="bi-arrow-down" label={`Bajar posición de ${unit.name}`} onClick={() => data.moveUnit(unit.id, 1)} disabled={index === subjectUnits.length - 1} />
                      <IconButton icon="bi-pencil" label={`Renombrar ${unit.name}`} onClick={() => setModal({ type: 'unit', unit })} />
                      <IconButton icon="bi-trash" label={`Eliminar ${unit.name}`} onClick={() => handleDeleteUnit(unit)} danger />
                    </Stack>
                  </Stack>

                  {open && (
                    <div id={bodyId} className="p-3">
                      <FileList
                        files={unitFiles}
                        actions={fileActions}
                        empty={unitTopics.length === 0 ? 'Unidad vacía: subí archivos o creá temas para organizarla.' : null}
                      />

                      {unitTopics.length > 0 && (
                        <Stack gap={3} className={unitFiles.length ? 'mt-3' : ''}>
                          {unitTopics.map((topic) => {
                            const topicFiles = filesOf(unit.id, topic.id)
                            return (
                              <div key={topic.id} className="border-start border-3 ps-3">
                                <Stack direction="horizontal" gap={2} className="mb-2">
                                  <i className="bi bi-bookmark text-secondary"></i>
                                  <span className="fw-semibold small flex-grow-1 text-break">{topic.name}</span>
                                  <span className="small text-secondary">{topicFiles.length}</span>
                                  <IconButton icon="bi-cloud-arrow-up" label={`Subir archivos a ${topic.name}`} onClick={() => openUpload(unit.id, topic.id)} />
                                  <IconButton icon="bi-pencil" label={`Renombrar ${topic.name}`} onClick={() => setModal({ type: 'topic', unitId: unit.id, topic })} />
                                  <IconButton icon="bi-trash" label={`Eliminar ${topic.name}`} onClick={() => handleDeleteTopic(topic)} danger />
                                </Stack>
                                <FileList files={topicFiles} actions={fileActions} empty="Sin archivos en este tema." />
                              </div>
                            )
                          })}
                        </Stack>
                      )}
                    </div>
                  )}
                </section>
              )
            })}

            {looseFiles.length > 0 && (
              <section className="border rounded-4 p-3" aria-label="Sin unidad">
                <p className="fw-bold mb-2">
                  <i className="bi bi-inbox me-2 text-secondary"></i>Sin unidad
                  <span className="text-secondary fw-normal small ms-2">Podés moverlos con el lápiz de cada archivo.</span>
                </p>
                <FileList files={looseFiles} actions={fileActions} />
              </section>
            )}
          </Stack>
        )}
      </PanelSection>

      {modal?.type === 'unit' && (
        <NameFormModal
          title={modal.unit ? 'Renombrar unidad' : 'Nueva unidad'}
          label="Nombre de la unidad"
          placeholder={`Ej.: Unidad ${subjectUnits.length + 1}: Introducción`}
          initial={modal.unit?.name ?? ''}
          submitLabel={modal.unit ? 'Guardar' : 'Crear unidad'}
          existing={subjectUnits.map((u) => u.name)}
          onSave={(name) => {
            if (modal.unit) data.updateUnit(modal.unit.id, { name })
            else data.addUnit({ subjectId, name })
          }}
          onHide={() => setModal(null)}
        />
      )}

      {modal?.type === 'topic' && (
        <NameFormModal
          title={modal.topic ? 'Renombrar tema' : `Nuevo tema en ${unitById[modal.unitId]?.name ?? 'la unidad'}`}
          label="Nombre del tema"
          placeholder="Ej.: Normalización"
          initial={modal.topic?.name ?? ''}
          submitLabel={modal.topic ? 'Guardar' : 'Crear tema'}
          existing={topicsOf(modal.unitId).map((t) => t.name)}
          onSave={(name) => {
            if (modal.topic) data.updateTopic(modal.topic.id, { name })
            else {
              data.addTopic({ unitId: modal.unitId, name })
              // Se abre la unidad para que se vea el tema nuevo
              setCollapsed((prev) => {
                const next = new Set(prev)
                next.delete(modal.unitId)
                return next
              })
            }
          }}
          onHide={() => setModal(null)}
        />
      )}

      {modal?.type === 'upload' && (
        <FileUploadModal subjectId={subjectId} defaults={modal.defaults} onUpload={handleUpload} onHide={() => setModal(null)} />
      )}

      {modal?.type === 'editFile' && (
        <FileEditModal
          file={modal.file}
          onSave={(changes) => {
            data.updateFile(modal.file.id, changes)
            showToast('Archivo actualizado')
          }}
          onDelete={handleDeleteFile}
          onHide={() => setModal(null)}
        />
      )}

      {modal?.type === 'preview' && <FilePreviewModal file={modal.file} onHide={() => setModal(null)} />}
    </>
  )
}
