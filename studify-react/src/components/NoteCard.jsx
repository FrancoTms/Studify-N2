import ToneIcon from './ToneIcon'

export default function NoteCard({ title, subject, date }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex gap-3">
        <ToneIcon icon="bi-journal-text fs-5" tone="danger" />
        <div>
          <h3 className="h6 fw-bold mb-1">{title}</h3>
          <span className="badge bg-primary-subtle text-primary mb-2">{subject}</span>
          <p className="text-secondary small mb-0">{date}</p>
        </div>
      </div>
    </div>
  )
}
