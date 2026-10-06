export default function ToneIcon({ icon, tone = 'primary', size = 44 }) {
  return (
    <span
      className={`d-flex align-items-center justify-content-center flex-shrink-0 rounded-3 bg-${tone}-subtle text-${tone}`}
      style={{ width: size, height: size }}
    >
      <i className={`bi ${icon}`}></i>
    </span>
  )
}
