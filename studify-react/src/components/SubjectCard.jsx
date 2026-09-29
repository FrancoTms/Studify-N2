import ProgressBar from 'react-bootstrap/ProgressBar'

export default function SubjectCard({ icon, name, teacher, progress, nextTask, tone = 'primary' }) {
  return (
    <article className="subject-card">
      <div className="d-flex align-items-start gap-3">
        <div className={`subject-icon ${tone}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div className="flex-grow-1">
          <h3 className="h6 mb-1">{name}</h3>
          {teacher && <p className="text-secondary small mb-2">{teacher}</p>}
          <ProgressBar now={progress} label={`${progress}%`} className="mb-2" />
          {nextTask && <p className="small mb-0"><strong>Próximo:</strong> {nextTask}</p>}
        </div>
      </div>
    </article>
  )
}
