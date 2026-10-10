import { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

export default function TaskItem({ title, subject, priority, completed = false }) {
  const [done, setDone] = useState(completed)
  const urgent = priority === 'Alta'

  return (
    <Stack
      as="label"
      direction="horizontal"
      gap={3}
      className="p-3 rounded-3 border bg-body"
      style={{ cursor: 'pointer' }}
    >
      <Form.Check.Input
        type="checkbox"
        className="m-0"
        checked={done}
        onChange={() => setDone(!done)}
      />
      <span className={`flex-grow-1 ${done ? 'opacity-50' : ''}`}>
        <span className={`d-block fw-semibold ${done ? 'text-decoration-line-through' : ''}`}>
          {title}
        </span>
        <span className="d-block text-secondary small">{subject}</span>
      </span>
      <Badge
        bg={urgent ? 'danger-subtle' : 'primary-subtle'}
        text={urgent ? 'danger' : 'primary'}
      >
        {priority}
      </Badge>
    </Stack>
  )
}