import { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import ToneIcon from './ToneIcon'
import { events, EVENT_TYPES } from '../data/events'
import {
  addDays,
  capitalize,
  formatLongDay,
  formatMonthYear,
  isSameDay,
  startOfDay,
  startOfMonth,
} from '../utils/dates'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Devuelve las semanas (de lunes a domingo) que hay que dibujar para el mes mostrado
function buildWeeks(viewDate) {
  const first = startOfMonth(viewDate)
  const offset = (first.getDay() + 6) % 7 // lunes = 0
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7
  const start = addDays(first, -offset)

  const weeks = []
  for (let i = 0; i < totalCells; i += 7) {
    weeks.push(Array.from({ length: 7 }, (_, j) => addDays(start, i + j)))
  }
  return weeks
}

const eventsOn = (day) => events.filter((e) => isSameDay(e.date, day))

export default function CalendarView() {
  // Mes que se está mirando (siempre el día 1) y día elegido
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(() => startOfDay(new Date()))

  const today = startOfDay(new Date())
  const weeks = buildWeeks(viewDate)
  const selectedEvents = eventsOn(selected)

  const goToMonth = (delta) =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))

  const goToToday = () => {
    setViewDate(startOfMonth(today))
    setSelected(today)
  }

  const handleSelect = (day) => {
    setSelected(day)
    // Si toca un día del mes anterior o siguiente, el calendario salta a ese mes
    if (day.getMonth() !== viewDate.getMonth()) setViewDate(startOfMonth(day))
  }

  return (
    <Row className="g-4">
      <Col lg={7}>
        <Stack direction="horizontal" gap={2} className="mb-3">
          <Button
            variant="light"
            className="border rounded-circle lh-1 p-2"
            onClick={() => goToMonth(-1)}
            aria-label="Mes anterior"
          >
            <i className="bi bi-chevron-left"></i>
          </Button>
          <h3 className="h5 mb-0 flex-grow-1 text-center" aria-live="polite">
            {capitalize(formatMonthYear(viewDate))}
          </h3>
          <Button
            variant="light"
            className="border rounded-circle lh-1 p-2"
            onClick={() => goToMonth(1)}
            aria-label="Mes siguiente"
          >
            <i className="bi bi-chevron-right"></i>
          </Button>
          <Button variant="outline-primary" size="sm" className="rounded-pill px-3 ms-2" onClick={goToToday}>
            Hoy
          </Button>
        </Stack>

        <Table
          borderless
          className="mb-0 text-center align-middle"
          style={{ tableLayout: 'fixed', '--bs-table-bg': 'transparent' }}
        >
          <thead>
            <tr>
              {WEEKDAYS.map((d) => (
                <th key={d} scope="col" className="small text-secondary fw-semibold pb-2">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0].toISOString()}>
                {week.map((day) => {
                  const inMonth = day.getMonth() === viewDate.getMonth()
                  const isSelected = isSameDay(day, selected)
                  const isToday = isSameDay(day, today)
                  const dayEvents = eventsOn(day)

                  let variant = 'link'
                  let textClass = inMonth ? 'text-body' : 'text-body-tertiary'
                  if (isSelected) {
                    variant = 'primary'
                    textClass = ''
                  } else if (isToday) {
                    variant = 'outline-primary'
                    textClass = ''
                  } else {
                    textClass += ' text-decoration-none'
                  }

                  const label = capitalize(formatLongDay(day))
                  return (
                    <td key={day.toISOString()} className="p-1">
                      <Button
                        variant={variant}
                        className={`w-100 rounded-3 py-1 px-0 ${textClass}`}
                        onClick={() => handleSelect(day)}
                        aria-pressed={isSelected}
                        aria-current={isToday ? 'date' : undefined}
                        aria-label={dayEvents.length ? `${label}, ${dayEvents.length} evento(s)` : label}
                      >
                        <span className="d-block fw-semibold">{day.getDate()}</span>
                        <span className="d-flex justify-content-center gap-1 mt-1" style={{ minHeight: 8 }}>
                          {dayEvents.map((e) => (
                            <Badge
                              key={e.id}
                              pill
                              bg={isSelected ? 'light' : EVENT_TYPES[e.type].tone}
                              className="p-1"
                              aria-hidden="true"
                            />
                          ))}
                        </span>
                      </Button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Table>

        <Stack direction="horizontal" gap={3} className="flex-wrap small text-secondary mt-3">
          {Object.values(EVENT_TYPES).map((t) => (
            <span key={t.label}>
              <Badge pill bg={t.tone} className="p-1 me-1" aria-hidden="true" />
              {t.label}
            </span>
          ))}
        </Stack>
      </Col>

      <Col lg={5}>
        <div className="bg-body-tertiary rounded-4 p-3 h-100">
          <h3 className="h6 fw-bold mb-1">{capitalize(formatLongDay(selected))}</h3>
          <p className="text-secondary small mb-3">
            {selectedEvents.length === 0
              ? 'Sin eventos'
              : `${selectedEvents.length} ${selectedEvents.length === 1 ? 'evento' : 'eventos'}`}
          </p>

          {selectedEvents.length === 0 ? (
            <p className="text-secondary mb-0">
              <i className="bi bi-calendar-x me-2"></i>No hay eventos para este día.
            </p>
          ) : (
            <Stack gap={2}>
              {selectedEvents.map((e) => {
                const type = EVENT_TYPES[e.type]
                return (
                  <Stack
                    key={e.id}
                    direction="horizontal"
                    gap={3}
                    className="bg-body border rounded-3 p-3 align-items-start"
                  >
                    <ToneIcon icon={`${type.icon} fs-5`} tone={type.tone} />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-0">{e.title}</p>
                      <p className="text-secondary small mb-1">{e.subject}</p>
                      <Badge bg={`${type.tone}-subtle`} text={type.tone}>{type.label}</Badge>
                    </div>
                  </Stack>
                )
              })}
            </Stack>
          )}
        </div>
      </Col>
    </Row>
  )
}
