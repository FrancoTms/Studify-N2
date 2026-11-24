import PanelSection from '../components/PanelSection'
import ChatAssistant from '../components/ChatAssistant'
import usePageTitle from '../hooks/usePageTitle'

export default function Assistant() {
  usePageTitle('IA Asistente | Studify')
  return (
    <PanelSection id="ia-asistente" tone="primary" title="IA Asistente" subtitle="Preguntale sobre tus tareas, exámenes, progreso o técnicas de estudio.">
      <ChatAssistant />
    </PanelSection>
  )
}
