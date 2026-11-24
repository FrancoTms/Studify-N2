import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import PanelSection from '../components/PanelSection'
import TechniqueCard from '../components/TechniqueCard'
import usePageTitle from '../hooks/usePageTitle'

const techniques = [
  {
    icon: 'bi-stopwatch',
    title: 'Pomodoro',
    description: 'Estudiá en intervalos de concentración y descanso.',
    duration: '25 + 5 min',
    steps: ['Elegí una tarea y una materia.', 'Estudiá 25 minutos sin distracciones.', 'Descansá 5 minutos.', 'Cada 4 ciclos, tomá un descanso largo de 15 minutos.'],
    to: '/pomodoro',
  },
  {
    icon: 'bi-diagram-3',
    title: 'Mapas mentales',
    description: 'Relacioná conceptos para comprender mejor los temas.',
    duration: '15–30 min',
    steps: ['Escribí el tema central en el medio de la hoja.', 'Agregá ramas con las ideas principales.', 'Sumá detalles, ejemplos y colores a cada rama.', 'Repasá el mapa explicándolo en voz alta.'],
  },
  {
    icon: 'bi-question-circle',
    title: 'Active Recall',
    description: 'Intentá recuperar la información sin mirar los apuntes.',
    duration: '20 min',
    steps: ['Leé un tema una sola vez.', 'Cerrá el material y escribí todo lo que recordás.', 'Compará con los apuntes y marcá lo que faltó.', 'Repetí enfocándote en lo que olvidaste.'],
    to: '/apuntes',
  },
  {
    icon: 'bi-arrow-repeat',
    title: 'Repaso espaciado',
    description: 'Repasá en intervalos cada vez más largos para recordar a largo plazo.',
    duration: '10 min por repaso',
    steps: ['Estudiá el tema hoy.', 'Repasalo mañana, en 3 días y en una semana.', 'Agendá cada repaso como sesión de estudio en el calendario.', 'Si te cuesta un tema, acortá el intervalo.'],
    to: '/calendario',
  },
  {
    icon: 'bi-person-video3',
    title: 'Técnica Feynman',
    description: 'Explicá el tema con palabras simples, como si se lo enseñaras a alguien.',
    duration: '15 min',
    steps: ['Elegí un concepto.', 'Explicalo por escrito como para un principiante.', 'Detectá dónde te trabás y volvé al material.', 'Simplificá la explicación y usá ejemplos.'],
  },
  {
    icon: 'bi-list-check',
    title: 'Simulacro de examen',
    description: 'Practicá con preguntas de parciales anteriores en tiempo real.',
    duration: '60 min',
    steps: ['Conseguí ejercicios o parciales viejos.', 'Resolvelos con el mismo tiempo que el examen.', 'Corregí y anotá los errores frecuentes.', 'Armá una tarea para repasar cada error.'],
    to: '/examenes',
  },
]

export default function Techniques() {
  usePageTitle('Técnicas de estudio | Studify')
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <PanelSection id="tecnicas-estudio" tone="warning" title="Técnicas de estudio" subtitle="Elegí una estrategia para tu próxima sesión.">
        <Row className="g-3">
          {techniques.map((technique) => (
            <Col md={6} xl={4} key={technique.title}>
              <TechniqueCard {...technique} onSelect={() => setSelected(technique)} />
            </Col>
          ))}
        </Row>
      </PanelSection>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        {selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title as="h2" className="h5 fw-bold">
                <i className={`bi ${selected.icon} me-2 text-primary`}></i>
                {selected.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-secondary">{selected.description}</p>
              <ol className="mb-0">
                {selected.steps.map((step) => (
                  <li key={step} className="mb-1">{step}</li>
                ))}
              </ol>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setSelected(null)}>Cerrar</Button>
              {selected.to && (
                <Button variant="primary" onClick={() => navigate(selected.to)}>Probar ahora</Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}
