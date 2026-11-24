// Mensaje para cuando una lista todavía no tiene elementos
export default function EmptyState({ icon = 'bi-inbox', title, text, children }) {
  return (
    <div className="text-center py-4 px-3 bg-body-tertiary rounded-4 border border-dashed">
      <i className={`bi ${icon} fs-1 text-primary d-block mb-2`} aria-hidden="true"></i>
      <p className="fw-semibold mb-1">{title}</p>
      {text && <p className="text-secondary small mb-3">{text}</p>}
      {children}
    </div>
  )
}
