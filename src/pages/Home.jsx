import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Plus, BookOpenCheck } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { getStatus, parseDue, formatLongDate, greeting, dayOfMonth, monthShort, formatHour, formatCountdown } from '../services/dateUtils.js'

const TABS = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'done', label: 'Concluídas' },
  { id: 'late', label: 'Atrasadas' },
]

export default function Home() {
  const { user, tasks, subjects, focusSessions = [] } = useAppData()
  const navigate = useNavigate()
  const [tab, setTab] = useState('todo')

  const open = useMemo(() => tasks.filter((t) => !t.done).sort((a, b) => parseDue(a) - parseDue(b)), [tasks])
  const upcoming = open.filter((t) => getStatus(t) !== 'late').slice(0, 2)
  const counts = {
    todo: open.length,
    done: tasks.filter((t) => t.done).length,
    late: open.filter((t) => getStatus(t) === 'late').length,
  }

  const visible = useMemo(() => {
    const byDue = (a, b) => parseDue(a) - parseDue(b)
    if (tab === 'done') return tasks.filter((t) => t.done).sort(byDue)
    if (tab === 'late') return open.filter((t) => getStatus(t) === 'late')
    return open
  }, [tab, tasks, open])

  const todayIso = new Date().toDateString()
  const studiedMinutes = focusSessions
    .filter((f) => (f.mode ?? 'focus') === 'focus' && new Date(f.startedAt).toDateString() === todayIso)
    .reduce((sum, f) => sum + (f.minutes || 0), 0)

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

  return (
    <>
      <PageHeader eyebrow={formatLongDate()} title={`${greeting()}, ${user.name}.`} />

      <section className="radar" aria-label="No seu radar">
        <span className="radar__tag">No seu radar</span>
        <h2 className="radar__title">
          Um passo de cada vez. <Sparkles size={16} />
        </h2>
        <p className="radar__summary">
          {counts.todo === 0 ? 'Tudo em dia por aqui.' : `${plural(counts.todo, 'tarefa pendente', 'tarefas pendentes')}${counts.late ? `, ${plural(counts.late, 'atrasada', 'atrasadas')}` : ''}.`}
        </p>
        <div className="radar__list">
          {upcoming.map((t) => {
            const subject = subjects.find((s) => s.id === t.subjectId)
            return (
              <Link key={t.id} to={`/tarefas/${t.id}/editar`} className="radar__item">
                <span className="radar__date">
                  <span className="radar__day">{dayOfMonth(t.dueDate)}</span>
                  <span className="radar__month">{monthShort(t.dueDate)}</span>
                </span>
                <span className="radar__info">
                  <span className="radar__name">{t.title}</span>
                  <span className="radar__sub" style={{ display: 'block' }}>{subject?.name} · {formatHour(t.dueTime)}</span>
                </span>
                <span className="radar__left">{formatCountdown(t)}</span>
              </Link>
            )
          })}
          {upcoming.length === 0 && <p className="radar__summary" style={{ margin: 0 }}>Nenhum prazo chegando. Aproveite para adiantar algo.</p>}
        </div>
      </section>

      <div className="section-head">
        <h2 className="section-head__title">Seu próximo passo</h2>
        <Link to="/tarefas" className="section-head__link">Ver todos ›</Link>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Filtrar tarefas" />
      <p className="section-count">
        {counts.todo} a fazer · {plural(counts.done, 'concluída', 'concluídas')} · {plural(counts.late, 'atrasada', 'atrasadas')}
      </p>

      <TaskList
        tasks={visible.slice(0, 4)}
        compact
        emptyTitle={tab === 'done' ? 'Nada concluído ainda' : tab === 'late' ? 'Nenhuma atrasada' : 'Sem tarefas pendentes'}
        emptyText={tab === 'late' ? 'Ótimo, você está no ritmo.' : 'Crie um novo passo quando quiser.'}
      />

      <button type="button" className="btn btn--primary fab" onClick={() => navigate('/tarefas/nova')}>
        <Plus size={16} /> To-do
      </button>
      <p className="home-note"><BookOpenCheck size={13} /> {studiedMinutes > 0 ? `Você já cuidou de ${studiedMinutes} min de estudo hoje. Bom ritmo!` : 'Um passo pequeno hoje já conta.'}</p>
    </>
  )
}
