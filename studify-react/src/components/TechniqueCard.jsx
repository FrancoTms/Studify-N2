import ToneIcon from './ToneIcon'

export default function TechniqueCard({ icon, title, description, duration, tone = 'success' }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <ToneIcon icon={`${icon} fs-5`} tone={tone} />
        <h3 className="h6 fw-bold mt-3 mb-1">{title}</h3>
        <p className="text-secondary small mb-3">{description}</p>
        <span className="badge bg-warning-subtle text-warning"><i className="bi bi-stopwatch me-1"></i>{duration}</span>
      </div>
    </div>
  )
}