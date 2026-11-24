import { useState } from 'react'
import PanelSection from '../components/PanelSection'
import CalendarView from '../components/CalendarView'
import EventFormModal from '../components/EventFormModal'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { confirmAction, showToast } from '../utils/alerts'

export default function Calendar() {
  usePageTitle('Calendario | Studify')
  const { addEvent, updateEvent, deleteEvent } = useData()
  const [editing, setEditing] = useState(null)

  const handleSave = (values) => {
    if (editing?.event) {
      updateEvent(editing.event.id, values)
      showToast('Evento actualizado')
    } else {
      addEvent(values)
      showToast('Evento agregado')
    }
  }

  const handleDelete = async (event) => {
    setEditing(null)
    const ok = await confirmAction({ title: '¿Eliminar el evento?', text: `"${event.title}" se va a borrar.` })
    if (ok) {
      deleteEvent(event.id)
      showToast('Evento eliminado')
    }
  }

  return (
    <>
      <PanelSection
        id="calendario"
        tone="info"
        title="Calendario"
        subtitle="Tus exámenes, entregas y sesiones de estudio. Elegí un día para agregar un evento."
      >
        <CalendarView
          onAdd={(date) => setEditing({ defaults: { date, type: 'study' } })}
          onEdit={(event) => setEditing({ event })}
          onDelete={handleDelete}
        />
      </PanelSection>

      {editing && (
        <EventFormModal
          event={editing.event}
          defaults={editing.defaults}
          onSave={handleSave}
          onDelete={handleDelete}
          onHide={() => setEditing(null)}
        />
      )}
    </>
  )
}
