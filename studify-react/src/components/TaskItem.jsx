import { useState } from 'react'

export default function TaskItem({ title, subject, priority, completed = false }) {
  const [done, setDone] = useState(completed)
  const urgent = priority === 'Alta'

  return (
    <label className="d-flex align-items-center gap-3 p-3 rounded-3 border" style={{ cursor: 'pointer' }}>
      <input type="checkbox" className="form-check-input m-0" checked={done} onChange={() => setDone(!done)} />
      <span className={`flex-grow-1 ${done ? 'opacity-50' : ''}`}>
        <span className={`d-block fw-semibold ${done ? 'text-decoration-line-through' : ''}`}>{title}</span>
        <span className="d-block text-secondary small">{subject}</span>
      </span>
      <span className={`badge ${urgent ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>{priority}</span>
    </label>
  )
}