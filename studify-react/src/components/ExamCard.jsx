export default function ExamCard({ subject, title, date, daysLeft, tone = 'primary' }) {
  return (
    <article className={`exam-card ${tone}`}>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <span className="badge text-bg-light mb-2">{subject}</span>
          <h3 className="h6 mb-1">{title}</h3>
          <p className="small text-secondary mb-0">{date}</p>
        </div>
        <div className="text-end">
          <strong className="d-block">{daysLeft}</strong>
          <small className="text-secondary">días</small>
        </div>
      </div>
    </article>
  )
}
