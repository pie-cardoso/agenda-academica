import { monthCells, markKinds, isoToDate } from '../../services/agendaUtils.js'

const HEAD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export default function MonthGrid({ selected, today, eventsByDate, onSelect }) {
  const cells = monthCells(isoToDate(selected))

  return (
    <div className="month" role="group" aria-label="Calendário do mês">
      {HEAD.map((h, i) => <span key={i} className="month__head" aria-hidden="true">{h}</span>)}
      {cells.map((iso, i) => {
        if (!iso) return <span key={`b${i}`} />
        const kinds = markKinds(eventsByDate[iso] ?? [])
        const cls = ['month__day', kinds[0] && `mark--${kinds[0]}`, iso === today && 'is-today', iso === selected && 'is-selected'].filter(Boolean).join(' ')
        return (
          <button key={iso} type="button" className={cls} onClick={() => onSelect(iso)} aria-label={`${Number(iso.slice(8))}${kinds.length ? `, com ${kinds.length} tipo(s) de evento` : ''}`} aria-pressed={iso === selected}>
            <span>{Number(iso.slice(8))}</span>
            <span className="month__dots">{kinds.slice(0, 3).map((k) => <i key={k} className={`dot dot--${k}`} />)}</span>
          </button>
        )
      })}
    </div>
  )
}
