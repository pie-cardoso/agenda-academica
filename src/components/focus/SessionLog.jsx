import { Check } from 'lucide-react'
import EmptyState from '../ui/EmptyState.jsx'

const hhmm = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export default function SessionLog({ sessions, subjects }) {
  if (sessions.length === 0) {
    return <EmptyState title="Nada plantado hoje">Conclua um ciclo de foco e ele aparece aqui.</EmptyState>
  }
  // sessions chega em ordem cronológica; mostramos a mais recente primeiro
  return (
    <ul className="session-log">
      {sessions.map((s, i) => ({ s, n: i + 1 })).reverse().map(({ s, n }) => (
        <li key={s.id} className="session-log__item">
          <span className="session-log__check"><Check size={12} strokeWidth={3} /></span>
          <span className="session-log__text">
            <span className="session-log__title">{subjects.find((x) => x.id === s.subjectId)?.name ?? 'Foco livre'} · Ciclo {n}</span>
            <span className="session-log__sub">{hhmm(s.startedAt)}–{hhmm(s.endedAt)} · registrado automaticamente</span>
          </span>
          <span className="session-log__min">{s.minutes} min</span>
        </li>
      ))}
    </ul>
  )
}
