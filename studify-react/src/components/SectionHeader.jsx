import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

// actionTo = ruta a la que lleva el botón; onAction = función que ejecuta (por ejemplo, abrir un formulario)
export default function SectionHeader({ title, subtitle, actionLabel, actionTo, onAction, actionIcon, children }) {
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
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        {children}
        {actionLabel && (
          <Button
            variant="outline-primary"
            size="sm"
            className="fw-bold"
            {...(actionTo ? { as: Link, to: actionTo } : { onClick: onAction })}
          >
            {actionIcon && <i className={`bi ${actionIcon} me-1`}></i>}
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
