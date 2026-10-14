import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import Stack from 'react-bootstrap/Stack'
import SectionHeader from './SectionHeader'
import { mascots } from '../data/mascots'

export default function PanelSection({ id, tone = 'primary', title, subtitle, actionLabel, children }) {
  const mascot = mascots[id]

  return (
    <Card
      as="section"
      id={id}
      className={`panel-section rounded-4 shadow border-2 border-${tone}-subtle overflow-hidden mb-4`}
    >
      <div className={`bg-${tone}-subtle px-4 pt-3`}>
        <Stack direction="horizontal" gap={3} className="align-items-end justify-content-between">
          <div className="flex-grow-1 pb-1">
            <SectionHeader title={title} subtitle={subtitle} actionLabel={actionLabel} />
          </div>
          {mascot && (
            <Image
              src={mascot}
              alt=""
              height={96}
              loading="lazy"
              className="panel-mascot flex-shrink-0 object-fit-contain d-none d-sm-block"
            />
          )}
        </Stack>
      </div>
      <Card.Body className="p-4">{children}</Card.Body>
    </Card>
  )
}