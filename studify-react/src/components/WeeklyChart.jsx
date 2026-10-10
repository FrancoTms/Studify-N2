import Stack from 'react-bootstrap/Stack'

const formatHours = (hours) => {
  const totalMin = Math.round(hours * 60)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

// data = [{ day: 'Lun', hours: 2.5 }, ...] empezando en lunes
export default function WeeklyChart({ data }) {
  const max = Math.max(...data.map((d) => d.hours), 1)
  const total = data.reduce((sum, d) => sum + d.hours, 0)
  const today = (new Date().getDay() + 6) % 7 // 0 = lunes

  const summary = data.map((d) => `${d.day} ${formatHours(d.hours)}`).join(', ')

  return (
    <div>
      <Stack direction="horizontal" className="justify-content-between align-items-baseline mb-3">
        <p className="text-secondary small mb-0">Horas de estudio por día</p>
        <p className="fw-semibold mb-0">Total: {formatHours(total)}</p>
      </Stack>

      <div role="img" aria-label={`Gráfico de barras de horas de estudio: ${summary}`}>
        <div className="d-flex align-items-end gap-2 gap-md-3 border-bottom px-1" style={{ height: 180 }}>
          {data.map((d, i) => (
            <div key={d.day} className="flex-fill h-100 d-flex align-items-end">
              <div
                className={`w-100 rounded-top bg-primary ${i === today ? '' : 'bg-opacity-50'}`}
                style={{ height: `${(d.hours / max) * 100}%`, minHeight: 4 }}
                title={`${d.day}: ${formatHours(d.hours)}`}
              />
            </div>
          ))}
        </div>

        <div className="d-flex gap-2 gap-md-3 px-1 pt-2 text-center">
          {data.map((d, i) => (
            <div key={d.day} className="flex-fill">
              <div className={`small ${i === today ? 'fw-bold text-primary' : 'fw-semibold'}`}>{d.day}</div>
              <div className="small text-secondary">{formatHours(d.hours)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
