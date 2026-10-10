import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

export default function SectionHeader({ title, subtitle, actionLabel }) {
  return (
    <Stack
      direction="horizontal"
      gap={2}
      className="flex-wrap align-items-end justify-content-between mb-3"
    >
      <div>
        <h2 className="h4 fw-bold mb-0">{title}</h2>
        {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button variant="outline-primary" size="sm" className="fw-bold">{actionLabel}</Button>
      )}
    </Stack>
  )
}