export default function NoteCard({ title, subject, date, icon = 'bi-journal-text' }) {
  return (
    <article className="note-card">
      <div className="d-flex align-items-start gap-3">
        <div className="note-icon">
          <i className={`bi ${icon}`}></i>
        </div>
        <div className="flex-grow-1">
          <h3 className="h6 mb-1">{title}</h3>
          <p className="small text-secondary mb-1">{subject}</p>
          {date && <small className="text-secondary">{date}</small>}
        </div>
        <button className="btn btn-sm btn-light" aria-label={`Abrir ${title}`}>
          <i className="bi bi-arrow-up-right"></i>
        </button>
      </div>
    </article>
  )
}
