import ToneIcon from './ToneIcon'

export default function StatCard({ icon, title, value, description, tone = 'primary' }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <ToneIcon icon={`${icon} fs-4`} tone={tone} size={52} />
        <div>
          <p className="text-secondary small mb-0">{title}</p>
          <p className="h4 fw-bold mb-0">{value}</p>
          <p className="text-secondary small mb-0">{description}</p>
        </div>
      </div>
    </div>
  )
}