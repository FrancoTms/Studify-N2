export default function TaskItem({ title, subject, completed = false, priority = 'Normal' }) {
  return (
    <label className="task-item d-flex align-items-center gap-3">
      <input type="checkbox" defaultChecked={completed} />
      <span className="flex-grow-1">
        <strong className="d-block">{title}</strong>
        <small className="text-secondary">{subject}</small>
      </span>
      <span className="badge text-bg-light">{priority}</span>
    </label>
  )
}
