// Utilidades para mostrar archivos: tamaño legible, ícono y tipo de vista previa

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB por archivo

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / 1024 ** i
  return `${value.toFixed(i === 0 || value >= 10 ? 0 : 1).replace('.', ',')} ${units[i]}`
}

export const extensionOf = (name) => {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

// Separa "apunte.final.pdf" en { base: 'apunte.final', ext: '.pdf' }
export function splitName(name) {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? { base: name.slice(0, dot), ext: name.slice(dot) } : { base: name, ext: '' }
}

const KINDS = [
  { kind: 'pdf', icon: 'bi-file-earmark-pdf-fill', tone: 'danger', label: 'PDF', exts: ['pdf'] },
  { kind: 'word', icon: 'bi-file-earmark-word-fill', tone: 'primary', label: 'Word', exts: ['doc', 'docx', 'odt', 'rtf'] },
  { kind: 'slides', icon: 'bi-file-earmark-slides-fill', tone: 'warning', label: 'Presentación', exts: ['ppt', 'pptx', 'odp', 'key'] },
  { kind: 'sheet', icon: 'bi-file-earmark-spreadsheet-fill', tone: 'success', label: 'Planilla', exts: ['xls', 'xlsx', 'ods', 'csv'] },
  { kind: 'image', icon: 'bi-file-earmark-image-fill', tone: 'info', label: 'Imagen', exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'] },
  { kind: 'video', icon: 'bi-file-earmark-play-fill', tone: 'danger', label: 'Video', exts: ['mp4', 'webm', 'mov', 'mkv', 'avi'] },
  { kind: 'audio', icon: 'bi-file-earmark-music-fill', tone: 'info', label: 'Audio', exts: ['mp3', 'wav', 'ogg', 'm4a', 'flac'] },
  { kind: 'zip', icon: 'bi-file-earmark-zip-fill', tone: 'secondary', label: 'Comprimido', exts: ['zip', 'rar', '7z', 'tar', 'gz'] },
  { kind: 'code', icon: 'bi-file-earmark-code-fill', tone: 'secondary', label: 'Código', exts: ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'html', 'css', 'json', 'sql', 'php'] },
  { kind: 'text', icon: 'bi-file-earmark-text-fill', tone: 'secondary', label: 'Texto', exts: ['txt', 'md'] },
]

const GENERIC = { kind: 'other', icon: 'bi-file-earmark-fill', tone: 'secondary', label: 'Archivo' }

export function fileKind(file) {
  const ext = extensionOf(file.name)
  const byExt = KINDS.find((k) => k.exts.includes(ext))
  if (byExt) return byExt
  const type = file.type ?? ''
  if (type === 'application/pdf') return KINDS[0]
  if (type.startsWith('image/')) return KINDS.find((k) => k.kind === 'image')
  if (type.startsWith('video/')) return KINDS.find((k) => k.kind === 'video')
  if (type.startsWith('audio/')) return KINDS.find((k) => k.kind === 'audio')
  if (type.startsWith('text/')) return KINDS.find((k) => k.kind === 'text')
  return GENERIC
}

// Qué se puede mostrar dentro de la app sin descargar
export function previewMode(file) {
  const { kind } = fileKind(file)
  if (kind === 'pdf') return 'pdf'
  if (kind === 'image') return 'image'
  if (kind === 'video') return 'video'
  if (kind === 'audio') return 'audio'
  if ((kind === 'text' || kind === 'code' || extensionOf(file.name) === 'csv') && file.size <= 2 * 1024 * 1024) return 'text'
  return null
}

// Descarga un Blob con el nombre indicado
export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
