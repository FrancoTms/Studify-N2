import { useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'
import UnitTopicSelect from './UnitTopicSelect'
import { MAX_FILE_SIZE, fileKind, formatBytes } from '../utils/files'

// Ventana para subir archivos: se eligen con el botón o se arrastran a la zona punteada
export default function FileUploadModal({ subjectId, defaults = {}, onUpload, onHide }) {
  const [location, setLocation] = useState({ unitId: defaults.unitId ?? null, topicId: defaults.topicId ?? null })
  const [selected, setSelected] = useState([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const addFiles = (list) => {
    const incoming = Array.from(list ?? [])
    if (!incoming.length) return
    setError('')
    // Evita repetir el mismo archivo si se elige dos veces
    setSelected((prev) => [
      ...prev,
      ...incoming.filter((f) => !prev.some((p) => p.name === f.name && p.size === f.size)),
    ])
  }

  const removeAt = (index) => setSelected((prev) => prev.filter((_, i) => i !== index))

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const valid = selected.filter((f) => f.size <= MAX_FILE_SIZE)

  const handleUpload = async () => {
    if (!valid.length) {
      setError('Elegí al menos un archivo de hasta 50 MB.')
      return
    }
    setUploading(true)
    await onUpload({ ...location, files: valid })
    setUploading(false)
    onHide()
  }

  return (
    <Modal show onHide={uploading ? undefined : onHide} centered size="lg" backdrop={uploading ? 'static' : true}>
      <Modal.Header closeButton={!uploading}>
        <Modal.Title as="h2" className="h5 fw-bold">Subir archivos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UnitTopicSelect subjectId={subjectId} {...location} onChange={setLocation} idPrefix="upload" />

        <div
          className={`mt-3 rounded-4 border border-2 border-dashed text-center p-4 ${dragging ? 'border-primary bg-primary-subtle' : 'bg-body-tertiary'}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          data-testid="dropzone"
        >
          <i className="bi bi-cloud-arrow-up fs-1 text-primary d-block mb-2" aria-hidden="true"></i>
          <p className="fw-semibold mb-1">Arrastrá tus archivos acá</p>
          <p className="text-secondary small mb-3">PDF, Word, PowerPoint, Excel, imágenes, ZIP y más · hasta 50 MB cada uno</p>
          <Button variant="outline-primary" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <i className="bi bi-folder2-open me-1"></i>Elegir archivos
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            aria-label="Elegir archivos para subir"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>

        {error && <Alert variant="danger" className="small mt-3 mb-0">{error}</Alert>}

        {selected.length > 0 && (
          <Stack as="ul" gap={2} className="list-unstyled mt-3 mb-0">
            {selected.map((file, i) => {
              const kind = fileKind(file)
              const tooBig = file.size > MAX_FILE_SIZE
              return (
                <Stack as="li" key={`${file.name}-${file.size}`} direction="horizontal" gap={2} className="border rounded-3 px-3 py-2">
                  <i className={`bi ${kind.icon} text-${kind.tone} fs-5`}></i>
                  <span className="flex-grow-1 text-truncate small fw-semibold" title={file.name}>{file.name}</span>
                  <span className={`small ${tooBig ? 'text-danger fw-semibold' : 'text-secondary'}`}>
                    {tooBig ? 'Supera 50 MB' : formatBytes(file.size)}
                  </span>
                  <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => removeAt(i)} disabled={uploading} aria-label={`Quitar ${file.name}`}>
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </Stack>
              )
            })}
          </Stack>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={uploading}>Cancelar</Button>
        <Button variant="primary" onClick={handleUpload} disabled={uploading || !valid.length}>
          {uploading && <Spinner size="sm" className="me-2" />}
          {valid.length > 1 ? `Subir ${valid.length} archivos` : 'Subir archivo'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
