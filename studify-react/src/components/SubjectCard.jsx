import ToneIcon from './ToneIcon'

export default function SubjectCard({ icon, name, teacher, progress, nextTask, tone = 'primary' }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <ToneIcon icon={`${icon} fs-5`} tone={tone} />
          <div>
            <h3 className="h6 fw-bold mb-0">{name}</h3>
            <p className="text-secondary small mb-0">{teacher}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between small fw-semibold mb-1">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
        <div className="progress mb-3" role="progressbar" aria-label={`Progreso en ${name}`} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ height: 8 }}>
          <div className={`progress-bar bg-${tone}`} style={{ width: `${progress}%` }}></div>
        </div>
        <p className="small mb-0"><i className="bi bi-flag me-1"></i>{nextTask}</p>
      </div>
    </div>
  )
}
