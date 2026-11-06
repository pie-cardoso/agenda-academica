import { weekDates, isoToDate, weekdayShort, markKinds } from '../../services/agendaUtils.js'

export default function WeekView({ selected, today, eventsByDate, onSelect }) {
  return (
    <div className="week">
      {weekDates(isoToDate(selected)).map((iso) => {
        const d = isoToDate(iso)
        const events = eventsByDate[iso] ?? []
        const shown = events.filter((e) => e.kind !== 'aula').slice(0, 2)
        const hidden = events.length - shown.length
        const cls = ['week__row', iso === today && 'is-today', iso === selected && 'is-selected'].filter(Boolean).join(' ')
        return (
          <button key={iso} type="button" className={cls} onClick={() => onSelect(iso)} aria-pressed={iso === selected}>
            <span className="week__date"><small>{weekdayShort(d)}</small><strong>{d.getDate()}</strong></span>
            <span className="week__events">
              {events.length === 0 && <span className="week__free">Livre</span>}
              {shown.map((e) => <span key={e.id} className={`week__tag tone-kind--${e.kind}`}>{e.name}</span>)}
              {hidden > 0 && <span className="week__more">{shown.length ? `+${hidden}` : `${hidden} ${hidden === 1 ? 'aula' : 'aulas'}`}</span>}
            </span>
            <span className="month__dots">{markKinds(events).slice(0, 3).map((k) => <i key={k} className={`dot dot--${k}`} />)}</span>
          </button>
        )
      })}
    </div>
  )
}
