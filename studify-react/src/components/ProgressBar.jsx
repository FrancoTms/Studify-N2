export default function ProgressBar({ label, value, detail }) {
  return (
    <div className="custom-progress mb-3">
      <div className="d-flex justify-content-between mb-1">
        <span className="small fw-semibold">{label}</span>
        <span className="small text-secondary">{value}%</span>
      </div>
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{ width: `${value}%` }} />
      </div>
      {detail && <small className="text-secondary">{detail}</small>}
    </div>
  )
}
