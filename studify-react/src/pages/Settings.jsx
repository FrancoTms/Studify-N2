import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PanelSection from '../components/PanelSection'
import PasswordField from '../components/PasswordField'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth, useData, usePomodoro } from '../context/contexts'
import { confirmAction, showError, showToast } from '../utils/alerts'
import { todayISO } from '../utils/dates'
import { storageEstimate } from '../utils/fileStore'
import { formatBytes } from '../utils/files'
import { cleanErrors, validatePassword } from '../utils/validation'

// Campos numéricos de Configuración con sus límites
const STUDY_FIELDS = [
  { key: 'weeklyGoalHours', label: 'Objetivo semanal', unit: 'horas', min: 1, max: 80 },
  { key: 'focusMinutes', label: 'Sesión de enfoque', unit: 'min', min: 5, max: 90 },
  { key: 'shortBreakMinutes', label: 'Descanso corto', unit: 'min', min: 1, max: 30 },
  { key: 'longBreakMinutes', label: 'Descanso largo', unit: 'min', min: 5, max: 60 },
]

function ProfileSection() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user.name)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Ingresá tu nombre.')
      return
    }
    updateProfile({ name })
    showToast('Perfil actualizado')
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row className="g-3 align-items-end">
        <Col md={5}>
          <Form.Group controlId="settings-name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              isInvalid={!!error}
              disabled={user.guest}
              maxLength={40}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group controlId="settings-email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control value={user.guest ? 'Modo invitado' : user.email} disabled readOnly />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button type="submit" className="w-100" disabled={user.guest || name.trim() === user.name}>Guardar</Button>
        </Col>
      </Row>
      {user.guest && (
        <Alert variant="info" className="small mt-3 mb-0">
          Estás usando Studify como invitado. Para tener tu propio perfil, cerrá sesión y creá una cuenta.
        </Alert>
      )}
    </Form>
  )
}

function PasswordSection() {
  const { changePassword } = useAuth()
  const empty = { current: '', next: '', confirm: '' }
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = cleanErrors({
      current: values.current ? undefined : 'Ingresá tu contraseña actual.',
      next: validatePassword(values.next),
      confirm: values.confirm !== values.next ? 'Las contraseñas no coinciden.' : undefined,
    })
    setErrors(found)
    if (Object.keys(found).length) return
    try {
      await changePassword(values.current, values.next)
      setValues(empty)
      showToast('Contraseña actualizada')
    } catch (err) {
      setErrors({ current: err.message })
    }
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={4}>
          <PasswordField id="pw-current" label="Contraseña actual" name="current" placeholder="" autoComplete="current-password" value={values.current} onChange={handleChange} error={errors.current} />
        </Col>
        <Col md={4}>
          <PasswordField id="pw-next" label="Nueva contraseña" name="next" autoComplete="new-password" value={values.next} onChange={handleChange} error={errors.next} />
        </Col>
        <Col md={4}>
          <PasswordField id="pw-confirm" label="Repetila" name="confirm" placeholder="" autoComplete="new-password" value={values.confirm} onChange={handleChange} error={errors.confirm} />
        </Col>
      </Row>
      <Button type="submit" variant="outline-primary">Cambiar contraseña</Button>
    </Form>
  )
}

function StudySection() {
  const { settings, updateSettings } = useData()
  const { running } = usePomodoro()
  const [values, setValues] = useState(() => Object.fromEntries(STUDY_FIELDS.map((f) => [f.key, String(settings[f.key])])))
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = {}
    const parsed = {}
    STUDY_FIELDS.forEach((f) => {
      const n = Number(values[f.key])
      if (!Number.isInteger(n) || n < f.min || n > f.max) found[f.key] = `Entre ${f.min} y ${f.max}.`
      else parsed[f.key] = n
    })
    setErrors(found)
    if (Object.keys(found).length) return
    updateSettings(parsed)
    showToast('Preferencias guardadas')
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row className="g-3 mb-3">
        {STUDY_FIELDS.map((f) => (
          <Col sm={6} lg={3} key={f.key}>
            <Form.Group controlId={`settings-${f.key}`}>
              <Form.Label>{f.label}</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  min={f.min}
                  max={f.max}
                  step={1}
                  value={values[f.key]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    setErrors((er) => ({ ...er, [f.key]: undefined }))
                  }}
                  isInvalid={!!errors[f.key]}
                />
                <InputGroup.Text>{f.unit}</InputGroup.Text>
                <Form.Control.Feedback type="invalid">{errors[f.key]}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
        ))}
      </Row>
      {running && <p className="small text-secondary">Los nuevos tiempos del Pomodoro se aplican cuando reinicies el reloj.</p>}
      <Button type="submit">Guardar preferencias</Button>
    </Form>
  )
}

function DataSection() {
  const { user, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const data = useData()
  const fileRef = useRef(null)
  const [storage, setStorage] = useState(null)
  const filesBytes = data.files.reduce((sum, f) => sum + f.size, 0)

  // Espacio del navegador: se vuelve a consultar cuando cambian los archivos
  useEffect(() => {
    let active = true
    storageEstimate().then((estimate) => active && setStorage(estimate))
    return () => {
      active = false
    }
  }, [data.files.length])
  const counts = `${data.subjects.length} materias, ${data.tasks.length} tareas, ${data.notes.length} apuntes, ${data.files.length} archivos, ${data.events.length} eventos y ${data.sessions.length} sesiones`

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data.exportData(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studify-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.subjects)) throw new Error('El archivo no tiene el formato de Studify.')
      const ok = await confirmAction({ title: '¿Importar el archivo?', text: 'Tus datos actuales se van a reemplazar por los del archivo. Los archivos subidos se conservan si su materia sigue existiendo.', confirmText: 'Importar' })
      if (!ok) return
      await data.importData(parsed)
      showToast('Datos importados')
    } catch (err) {
      showError(err.message === 'El archivo no tiene el formato de Studify.' ? err.message : 'No pudimos leer el archivo. Revisá que sea una copia exportada desde Studify.', 'No se pudo importar')
    }
  }

  const handleSample = async () => {
    const ok = await confirmAction({ title: '¿Cargar datos de ejemplo?', text: 'Se van a reemplazar tus datos actuales (incluidos los archivos subidos) por datos de ejemplo.', confirmText: 'Cargar' })
    if (ok) {
      await data.loadSampleData()
      showToast('Datos de ejemplo cargados')
    }
  }

  const handleReset = async () => {
    const ok = await confirmAction({ title: '¿Borrar todos tus datos?', text: `Se van a eliminar ${counts}. No se puede deshacer.`, confirmText: 'Borrar todo' })
    if (ok) {
      await data.resetData()
      showToast('Datos borrados')
    }
  }

  const handleDeleteAccount = async () => {
    const ok = await confirmAction({
      title: user.guest ? '¿Salir y borrar los datos del invitado?' : '¿Eliminar tu cuenta?',
      text: 'Se van a borrar tu cuenta y todos tus datos de este navegador. No se puede deshacer.',
      confirmText: 'Eliminar',
    })
    if (ok) {
      await data.purgeFiles()
      deleteAccount()
      navigate('/login', { replace: true })
    }
  }

  return (
    <>
      <p className="text-secondary small mb-1">
        Tus datos se guardan en este navegador. Tenés {counts}.
      </p>
      <p className="text-secondary small">
        <i className="bi bi-hdd me-1"></i>
        Archivos subidos: {formatBytes(filesBytes)}
        {storage?.quota ? ` · Espacio usado en el navegador: ${formatBytes(storage.usage)} de ${formatBytes(storage.quota)} disponibles` : ''}
        . La copia exportada incluye todo menos los archivos.
      </p>
      <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
        <Button variant="outline-primary" onClick={handleExport}>
          <i className="bi bi-download me-1"></i>Exportar copia
        </Button>
        <Button variant="outline-primary" onClick={() => fileRef.current?.click()}>
          <i className="bi bi-upload me-1"></i>Importar copia
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
        <Button variant="outline-secondary" onClick={handleSample}>
          <i className="bi bi-stars me-1"></i>Cargar datos de ejemplo
        </Button>
      </Stack>

      <div className="border border-danger-subtle rounded-4 p-3">
        <p className="fw-bold text-danger mb-1">Zona de peligro</p>
        <Stack direction="horizontal" gap={2} className="flex-wrap">
          <Button variant="outline-danger" onClick={handleReset}>
            <i className="bi bi-trash me-1"></i>Borrar todos los datos
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <i className="bi bi-person-x me-1"></i>{user.guest ? 'Borrar datos del invitado' : 'Eliminar cuenta'}
          </Button>
        </Stack>
      </div>
    </>
  )
}

export default function Settings() {
  usePageTitle('Configuración | Studify')
  const { user } = useAuth()
  const { theme, onToggleTheme } = useOutletContext()

  return (
    <>
      <PanelSection id="configuracion" tone="primary" title="Configuración" subtitle="Tu perfil y preferencias de Studify.">
        <h3 className="h6 fw-bold mb-3">Perfil</h3>
        <ProfileSection />

        {!user.guest && (
          <>
            <hr className="my-4" />
            <h3 className="h6 fw-bold mb-3">Contraseña</h3>
            <PasswordSection />
          </>
        )}

        <hr className="my-4" />
        <h3 className="h6 fw-bold mb-3">Apariencia</h3>
        <Form.Check
          type="switch"
          id="settings-theme"
          label="Tema oscuro"
          checked={theme === 'dark'}
          onChange={onToggleTheme}
        />
      </PanelSection>

      <PanelSection id="ajustes-estudio" tone="info" title="Estudio y Pomodoro" subtitle="Tu objetivo semanal y la duración de cada sesión.">
        <StudySection />
      </PanelSection>

      <PanelSection id="datos" tone="warning" title="Mis datos" subtitle="Guardá una copia, restaurala o empezá de cero.">
        <DataSection />
      </PanelSection>
    </>
  )
}
