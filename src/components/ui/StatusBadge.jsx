import { CalendarClock, Check, CircleAlert, CircleDashed } from 'lucide-react'
import { STATUS_LABEL } from '../../services/dateUtils.js'

const ICONS = { done: Check, late: CircleAlert, today: CalendarClock, soon: CalendarClock, pending: CircleDashed }

export default function StatusBadge({ status }) {
  const Icon = ICONS[status]
  return (
    <span className={`badge badge--${status}`}>
      <Icon size={11} /> {STATUS_LABEL[status]}
    </span>
  )
}
