export default function StatCard({ icon, title, value, description, tone = 'primary' }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {description && <p className="stat-description">{description}</p>}
      </div>
    </article>
  )
}
