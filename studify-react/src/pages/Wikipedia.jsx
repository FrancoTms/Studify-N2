import PanelSection from '../components/PanelSection'
import WikiSearch from '../components/WikiSearch'
import usePageTitle from '../hooks/usePageTitle'

export default function Wikipedia() {
  usePageTitle('Buscar en Wikipedia | Studify')
  return (
    <PanelSection id="wikipedia" tone="warning" title="Buscar en Wikipedia" subtitle="Investigá un tema y guardalo en tus apuntes sin salir de Studify.">
      <WikiSearch />
    </PanelSection>
  )
}
