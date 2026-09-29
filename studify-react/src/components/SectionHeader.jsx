export default function SectionHeader({ title, subtitle, actionLabel, actionHref = '#' }) {
  return (
    <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
      <div>
        <h2 className="h4 mb-1">{title}</h2>
        {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
      </div>
      {actionLabel && (
        <a href={actionHref} className="btn btn-sm btn-outline-primary">
          {actionLabel}
        </a>
      )}
    </div>
  )
}
