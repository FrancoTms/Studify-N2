export default function ProgressBar({ label, value, detail }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between fw-semibold mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" style={{ height: 10 }}>
        <div className="progress-bar" style={{ width: `${value}%` }}></div>
      </div>
      <p className="text-secondary small mb-0 mt-1">{detail}</p>
    </div>
  )
}
