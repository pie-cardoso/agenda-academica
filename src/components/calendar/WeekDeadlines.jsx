import { KIND_LABEL, isoToDate } from '../../services/agendaUtils.js'

export default function WeekDeadlines({ items, onSelect }) {
  return (
    <section className="deadlines" aria-label="Ainda nesta semana">
      <h3 className="deadlines__title">Ainda nesta semana</h3>
      {items.length === 0 ? (
        <p className="deadlines__empty">Nenhum prazo pela frente. Semana tranquila.</p>
      ) : (
        <ul>
          {items.map((e) => (
            <li key={e.id}>
              <button type="button" className="deadlines__row" onClick={() => onSelect(e.date)}>
                <span className={`deadlines__when tone-kind--${e.kind}`}>{isoToDate(e.date).getDate()} · {e.time.replace(':00', 'h').replace(':', 'h')}</span>
                <span className="deadlines__what">
                  {KIND_LABEL[e.kind]} – {e.name}{e.kind === 'prova' && e.subjectName ? `, ${e.subjectName}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
