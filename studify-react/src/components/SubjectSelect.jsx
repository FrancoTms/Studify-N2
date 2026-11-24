import Form from 'react-bootstrap/Form'
import { useData } from '../context/contexts'

// Lista desplegable con las materias del usuario. value = id de la materia o '' (sin materia)
export default function SubjectSelect({ value, onChange, allLabel, id, size, className, ariaLabel }) {
  const { subjects } = useData()

  return (
    <Form.Select
      id={id}
      size={size}
      className={className}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
    >
      <option value="">{allLabel ?? 'Sin materia'}</option>
      {subjects.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </Form.Select>
  )
}
