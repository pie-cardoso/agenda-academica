import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, Pause, RotateCcw, SkipForward, Sprout } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import TimerRing from '../components/focus/TimerRing.jsx'
import CycleDots from '../components/focus/CycleDots.jsx'
import TaskPicker from '../components/focus/TaskPicker.jsx'
import SessionLog from '../components/focus/SessionLog.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { usePomodoro, CYCLES_PER_SET, DURATIONS } from '../context/PomodoroContext.jsx'
import { parseDue } from '../services/dateUtils.js'

const MODES = [
  { id: 'focus', label: 'Foco' },
  { id: 'short', label: 'Pausa curta' },
  { id: 'long', label: 'Pausa longa' },
]

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Focus() {
  const { tasks, subjects, focusSessions = [] } = useAppData()
  const p = usePomodoro()
  const [params, setParams] = useSearchParams()

  const openTasks = useMemo(() => tasks.filter((t) => !t.done).sort((a, b) => parseDue(a) - parseDue(b)), [tasks])

  // Seleção efetiva: a escolhida (se ainda válida) ou a tarefa mais próxima do prazo
  const fallback = { taskId: openTasks[0]?.id ?? '', subjectId: openTasks[0]?.subjectId ?? '' }
  const valid = p.target && (!p.target.taskId || openTasks.some((t) => t.id === p.target.taskId))
  const target = valid ? p.target : fallback

  // Vindo do detalhe da matéria ("Estudar Cálculo"): /foco?materia=id
  useEffect(() => {
    const subjectId = params.get('materia')
    if (!subjectId) return
    const task = openTasks.find((t) => t.subjectId === subjectId)
    p.setTarget(task ? { taskId: task.id, subjectId } : { taskId: '', subjectId })
    setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePick = (taskId) => {
    const task = openTasks.find((t) => t.id === taskId)
    p.setTarget({ taskId, subjectId: task?.subjectId ?? '' })
  }

  // Registros de hoje
  const todaySessions = useMemo(() => {
    const today = new Date().toDateString()
    return focusSessions
      .filter((f) => (f.mode ?? 'focus') === 'focus' && new Date(f.startedAt).toDateString() === today)
      .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
  }, [focusSessions])
  const todayMinutes = todaySessions.reduce((sum, f) => sum + (f.minutes || 0), 0)

  const isFocus = p.mode === 'focus'
  const untouched = !p.running && p.remaining === p.total
  const status = p.running ? (isFocus ? 'Em foco' : p.mode === 'long' ? 'Pausa longa' : 'Em pausa') : untouched ? 'Pronto' : 'Pausado'
  const cycleLabel = isFocus ? `Ciclo ${Math.min(p.cycles + 1, CYCLES_PER_SET)} de ${CYCLES_PER_SET} · ${DURATIONS.focus / 60} min` : 'Respire e solte os ombros'
  const subjectName = subjects.find((s) => s.id === (openTasks.find((t) => t.id === target.taskId)?.subjectId ?? target.subjectId))?.name

  return (
    <>
      <PageHeader eyebrow="Seu momento de foco" title="Agora, uma coisa só." />

      <TaskPicker tasks={openTasks} subjects={subjects} target={target} onChange={handlePick} />

      <section className={`timer-card timer-card--${p.mode}`} aria-label="Timer Pomodoro">
        <Tabs tabs={MODES} value={p.mode} onChange={p.selectMode} label="Tipo de ciclo" />

        <TimerRing progress={1 - p.remaining / p.total} mode={p.mode}>
          <span className="ring__status">{status}</span>
          <span className="ring__time" role="timer" aria-live="off">{mmss(p.remaining)}</span>
          <span className="ring__cycle">{cycleLabel}</span>
        </TimerRing>

        <CycleDots cycles={p.cycles} mode={p.mode} />

        <div className="timer-actions">
          <button type="button" className="btn btn--primary" onClick={() => (p.running ? p.pause() : p.start(target))}>
            {p.running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> {untouched ? 'Iniciar' : 'Continuar'}</>}
          </button>
          <button type="button" className="btn btn--soft timer-actions__reset" onClick={p.reset} aria-label="Reiniciar timer"><RotateCcw size={16} /></button>
        </div>

        <p className="timer-card__hint">Pausa curta 5 min, pausa longa 15 min a cada {CYCLES_PER_SET} ciclos.</p>
        <button type="button" className="timer-card__skip" onClick={p.skip}>
          <SkipForward size={13} /> {isFocus ? 'Pular para a pausa' : 'Pular pausa'}
        </button>
      </section>

      <p className="focus-note">
        <Sprout size={16} />
        <span><strong>Seu esforço fica registrado.</strong> Cada ciclo de foco concluído é salvo automaticamente e destaca o dia no calendário{subjectName ? ` (agora: ${subjectName})` : ''}.</span>
      </p>

      <div className="section-head" style={{ marginTop: 22 }}>
        <h2 className="section-head__title">O que já floresceu</h2>
        <span className="section-head__link" style={{ color: 'var(--ink-soft)' }}>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')}</span>
      </div>
      <div className="focus-totals">
        <span className="badge badge--pending">{todayMinutes} min de estudo</span>
        <span className="badge badge--done">{todaySessions.length} {todaySessions.length === 1 ? 'ciclo concluído' : 'ciclos concluídos'}</span>
      </div>
      <SessionLog sessions={todaySessions} subjects={subjects} />
    </>
  )
}
