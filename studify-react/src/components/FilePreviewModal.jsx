import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { useData } from '../context/contexts'
import { downloadBlob, fileKind, formatBytes, previewMode } from '../utils/files'

// Muestra el archivo dentro de la app cuando el navegador puede (PDF, imágenes, texto, audio y video)
export default function FilePreviewModal({ file, onHide }) {
  const { getFileBlob } = useData()
  const [state, setState] = useState({ status: 'loading' })
  const mode = previewMode(file)
  const kind = fileKind(file)

  useEffect(() => {
    let url = null
    let active = true
    getFileBlob(file.id)
      .then(async (blob) => {
        if (!active) return
        if (!blob) {
          setState({ status: 'missing' })
          return
        }
        // Para PDF se fuerza el tipo, así el navegador lo muestra aunque el archivo no lo traiga
        const typed = mode === 'pdf' && blob.type !== 'application/pdf' ? new Blob([blob], { type: 'application/pdf' }) : blob
        url = URL.createObjectURL(typed)
        const text = mode === 'text' ? await blob.text() : null
        if (active) setState({ status: 'ready', blob, url, text })
      })
      .catch(() => active && setState({ status: 'error' }))
    return () => {
      active = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [file.id, getFileBlob, mode])

  const { status, blob, url, text } = state

  return (
    <Modal show onHide={onHide} centered size={mode ? 'xl' : undefined} fullscreen={mode === 'pdf' ? 'md-down' : undefined}>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h6 fw-bold text-break">
          <i className={`bi ${kind.icon} text-${kind.tone} me-2`}></i>
          {file.name}
          <span className="text-secondary fw-normal small ms-2">{formatBytes(file.size)}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={mode === 'pdf' ? 'p-0' : undefined}>
        {status === 'loading' && (
          <div className="text-center py-5">
            <Spinner />
          </div>
        )}
        {status === 'missing' && (
          <Alert variant="warning" className="m-3">
            No encontramos el contenido de este archivo en el navegador. Puede que se haya borrado el almacenamiento del sitio.
          </Alert>
        )}
        {status === 'error' && <Alert variant="danger" className="m-3">No pudimos abrir el archivo.</Alert>}
        {status === 'ready' && mode === 'pdf' && (
          <iframe src={url} title={file.name} className="w-100 border-0 d-block" style={{ height: '75vh' }} />
        )}
        {status === 'ready' && mode === 'image' && (
          <img src={url} alt={file.name} className="img-fluid d-block mx-auto rounded-3" style={{ maxHeight: '75vh' }} />
        )}
        {status === 'ready' && mode === 'video' && (
          <video src={url} controls className="w-100 rounded-3" style={{ maxHeight: '75vh' }} />
        )}
        {status === 'ready' && mode === 'audio' && <audio src={url} controls className="w-100" />}
        {status === 'ready' && mode === 'text' && (
          <pre className="bg-body-tertiary rounded-3 p-3 mb-0 small" style={{ maxHeight: '70vh', whiteSpace: 'pre-wrap' }}>{text}</pre>
        )}
        {status === 'ready' && !mode && (
          <div className="text-center py-4">
            <i className={`bi ${kind.icon} text-${kind.tone} display-4 d-block mb-3`}></i>
            <p className="mb-1 fw-semibold">Este tipo de archivo ({kind.label}) no se puede ver dentro de Studify.</p>
            <p className="text-secondary small mb-0">Descargalo para abrirlo con su programa (Word, PowerPoint, Excel, etc.).</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Cerrar</Button>
        <Button variant="primary" disabled={status !== 'ready'} onClick={() => downloadBlob(blob, file.name)}>
          <i className="bi bi-download me-1"></i>Descargar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
