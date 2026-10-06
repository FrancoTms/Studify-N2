import ToneIcon from './ToneIcon'

export default function ExamCard({ subject, title, date, daysLeft, tone = 'primary' }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
          <ToneIcon icon="bi-calendar-event fs-5" tone={tone} />
          <span className={`badge text-bg-${tone}`}>
            {daysLeft === 1 ? 'Falta 1 día' : `Faltan ${daysLeft} días`}
          </span>
        </div>
        <p className="text-secondary small mb-0">{subject}</p>
        <h3 className="h6 fw-bold mb-1">{title}</h3>
        <p className="small mb-0"><i className="bi bi-clock me-1"></i>{date}</p>
      </div>
    </div>
  )
}