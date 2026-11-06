import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import MonthGrid from '../components/calendar/MonthGrid.jsx'
import WeekView from '../components/calendar/WeekView.jsx'
import DayAgenda from '../components/calendar/DayAgenda.jsx'
import WeekDeadlines from '../components/calendar/WeekDeadlines.jsx'
import EventFormModal from '../components/calendar/EventFormModal.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { addDays, toISODate } from '../services/dateUtils.js'
import { getEventsForDate, monthCells, weekDates, isoToDate, shiftMonth, monthTitle } from '../services/agendaUtils.js'

const VIEWS = [{ id: 'mensal', label: 'Mensal' }, { id: 'semanal', label: 'Semanal' }]
const LEGEND = [['prova', 'Prova'], ['entrega', 'Entrega'], ['apresentacao', 'Apresentação'], ['estudo', 'Estudo']]

export default function Agenda() {
  const data = useAppData()
  const today = toISODate(new Date())
  const [view, setView] = useState('mensal')
  const [selected, setSelected] = useState(today)
  const [creating, setCreating] = useState(false)

  const selDate = isoToDate(selected)

  // Eventos de todos os dias visíveis (mês ou semana) + o dia selecionado
  const eventsByDate = useMemo(() => {
    const days = view === 'mensal' ? monthCells(selDate).filter(Boolean) : weekDates(selDate)
    const map = {}
    for (const iso of new Set([...days, selected])) map[iso] = getEventsForDate(iso, data)
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selected, data.tasks, data.subjects, data.events, data.focusSessions])

  // "Ainda nesta semana": prazos de amanhã até domingo
  const deadlines = useMemo(() => {
    const out = []
    const now = new Date()
    const daysLeft = (7 - now.getDay()) % 7 // até o domingo
    for (let i = 1; i <= daysLeft; i++) {
      const iso = toISODate(addDays(i, now))
      getEventsForDate(iso, data).filter((e) => ['prova', 'entrega', 'apresentacao'].includes(e.kind) && !e.done).forEach((e) => out.push({ ...e, date: iso }))
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.tasks, data.subjects, data.events])

  const go = (dir) => setSelected(toISODate(view === 'mensal' ? shiftMonth(selDate, dir) : addDays(7 * dir, selDate)))

  const label = view === 'mensal' ? monthTitle(selDate) : (() => {
    const w = weekDates(selDate)
    const fmt = (iso) => isoToDate(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')
    return `${fmt(w[0])} – ${fmt(w[6])}`
  })()

  return (
    <>
      <PageHeader
        eyebrow="Calendário acadêmico"
        title="Tempo para tudo."
        action={<button type="button" className="icon-btn icon-btn--filled" onClick={() => setCreating(true)} aria-label="Novo evento"><Plus size={18} /></button>}
      />

      <Tabs tabs={VIEWS} value={view} onChange={setView} label="Modo de visualização" />

      <section className="calendar-card">
        <div className="calendar-card__bar">
          <h2 className="calendar-card__title">{label}</h2>
          <div className="calendar-card__nav">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={view === 'mensal' ? 'Mês anterior' : 'Semana anterior'}><ChevronLeft size={16} /></button>
            <button type="button" className="calendar-card__today" onClick={() => setSelected(today)}>Hoje</button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={view === 'mensal' ? 'Próximo mês' : 'Próxima semana'}><ChevronRight size={16} /></button>
          </div>
        </div>

        {view === 'mensal'
          ? <MonthGrid selected={selected} today={today} eventsByDate={eventsByDate} onSelect={setSelected} />
          : <WeekView selected={selected} today={today} eventsByDate={eventsByDate} onSelect={setSelected} />}

        <ul className="legend">
          {LEGEND.map(([k, text]) => <li key={k}><i className={`dot dot--${k}`} /> {text}</li>)}
        </ul>
      </section>

      <DayAgenda iso={selected} today={today} events={eventsByDate[selected] ?? []} onRemove={data.removeEvent} />

      <WeekDeadlines items={deadlines} onSelect={setSelected} />

      {creating && (
        <EventFormModal
          defaultDate={selected}
          onClose={() => setCreating(false)}
          onSubmit={(ev) => { data.addEvent(ev); setSelected(ev.date); setCreating(false) }}
        />
      )}
    </>
  )
}
