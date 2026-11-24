import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import { fileKind, formatBytes } from '../utils/files'
import { formatRelative } from '../utils/dates'

export default function FileItem({ file, location, onOpen, onDownload, onEdit, onDelete }) {
  const kind = fileKind(file)

  return (
    <Stack direction="horizontal" gap={3} className="bg-body border rounded-3 px-3 py-2 file-item">
      <i className={`bi ${kind.icon} text-${kind.tone} fs-4 flex-shrink-0`} aria-hidden="true"></i>
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <button
          type="button"
          className="btn btn-link p-0 text-reset text-decoration-none fw-semibold small text-start text-break"
          onClick={() => onOpen(file)}
          title="Abrir"
        >
          {file.name}
        </button>
        <p className="text-secondary small mb-0">
          {kind.label} · {formatBytes(file.size)} · subido {formatRelative(file.uploadedAt)}
          {location && <> · <i className="bi bi-folder2 me-1"></i>{location}</>}
        </p>
      </div>
      <Stack direction="horizontal" gap={1} className="flex-shrink-0">
        <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => onDownload(file)} aria-label={`Descargar ${file.name}`} title="Descargar">
          <i className="bi bi-download"></i>
        </Button>
        <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => onEdit(file)} aria-label={`Editar ${file.name}`} title="Renombrar o mover">
          <i className="bi bi-pencil"></i>
        </Button>
        <Button variant="link" size="sm" className="text-danger p-1" onClick={() => onDelete(file)} aria-label={`Eliminar ${file.name}`} title="Eliminar">
          <i className="bi bi-trash"></i>
        </Button>
      </Stack>
    </Stack>
  )
}
