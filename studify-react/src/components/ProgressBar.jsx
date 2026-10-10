import BsProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'

export default function ProgressBar({ label, value, detail }) {
  return (
    <div className="mb-3">
      <Stack direction="horizontal" className="justify-content-between fw-semibold mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </Stack>
      <BsProgressBar now={value} aria-label={label} className="rounded-pill" style={{ height: 9 }} />
      <p className="text-secondary small mb-0 mt-1">{detail}</p>
    </div>
  )
}