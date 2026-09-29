export default function TechniqueCard({ icon, title, description, duration }) {
  return (
    <article className="technique-card">
      <div className="technique-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="h6 mt-3">{title}</h3>
      <p className="small text-secondary">{description}</p>
      {duration && <span className="badge rounded-pill text-bg-light">{duration}</span>}
    </article>
  )
}
