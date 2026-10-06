export default function SectionHeader({ title, subtitle, actionLabel }) {
  return (
    <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
      <div>
        <h2 className="h4 fw-bold mb-0">{title}</h2>
        {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
      </div>
      {actionLabel && <button type="button" className="btn btn-outline-primary btn-sm">{actionLabel}</button>}
    </div>
  )
}
