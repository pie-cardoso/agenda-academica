import { Link } from 'react-router-dom'
import { BookOpen, Send, ClipboardList, Presentation, Check, Trash2 } from 'lucide-react'
import EmptyState from '../ui/EmptyState.jsx'
import { dayHeading, isoToDate, weekdayLong } from '../../services/agendaUtils.js'

const ICONS = { aula: BookOpen, entrega: Send, prova: ClipboardList, apresentacao: Presentation, estudo: Check }

function Card({ event }) {
  const Icon = ICONS[event.kind]
  const body = (
    <>
      <span className="agenda-card__icon"><Icon size={14} /></span>
      <span className="agenda-card__text">
        <span className="agenda-card__title">{event.title}{event.kind === 'estudo' ? ' ✓' : ''}</span>
        {event.subtitle && <span className="agenda-card__sub">{event.subtitle}</span>}
      </span>
    </>
  )
  const cls = `agenda-card tone-kind--${event.kind}${event.done && event.kind === 'entrega' ? ' is-done' : ''}`
  return event.href ? <Link to={event.href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>
}

export default function DayAgenda({ iso, today, events, onRemove }) {
  return (
    <section aria-label="Agenda do dia">
      <div className="section-head">
        <h2 className="section-head__title">{dayHeading(iso, today)}</h2>
        <span className="section-head__link" style={{ color: 'var(--ink-soft)' }}>{weekdayLong(isoToDate(iso))}</span>
      </div>

      {events.length === 0 ? (
        <EmptyState title="Dia livre">Nada marcado para este dia. Use o + para adicionar um evento.</EmptyState>
      ) : (
        <ul className="agenda-list">
          {events.map((e) => (
            <li key={e.id} className="agenda-row">
              <time className="agenda-row__time">{e.time}</time>
              <Card event={e} />
              {e.removableId && (
                <button type="button" className="icon-btn" aria-label={`Remover ${e.title}`}
                  onClick={() => window.confirm(`Remover "${e.title}"?`) && onRemove(e.removableId)}>
                  <Trash2 size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
