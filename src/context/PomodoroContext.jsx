import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAppData } from './AppDataContext.jsx'

export const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 }
export const CYCLES_PER_SET = 4

const PomodoroContext = createContext(null)

const MODE_LABEL = { focus: 'Foco', short: 'Pausa curta', long: 'Pausa longa' }
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function PomodoroProvider({ children }) {
  const { addFocusSession } = useAppData()
  const [mode, setMode] = useState('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0) // ciclos de foco concluídos no conjunto atual (0–4)
  const [target, setTarget] = useState(null) // { taskId, subjectId }

  const endAt = useRef(0)
  const startedAt = useRef(null)
  const latest = useRef({})
  latest.current = { mode, cycles, target, addFocusSession }

  const goTo = useCallback((nextMode) => {
    endAt.current = 0
    startedAt.current = null
    setRunning(false)
    setMode(nextMode)
    setRemaining(DURATIONS[nextMode])
  }, [])

  const finish = useCallback(() => {
    const { mode: m, cycles: c, target: tg, addFocusSession: add } = latest.current
    endAt.current = 0
    if (m === 'focus') {
      add({
        subjectId: tg?.subjectId || null,
        taskId: tg?.taskId || null,
        mode: 'focus',
        minutes: DURATIONS.focus / 60,
        startedAt: startedAt.current ?? new Date(Date.now() - DURATIONS.focus * 1000).toISOString(),
        endedAt: new Date().toISOString(),
      })
      const next = c + 1
      setCycles(next)
      goTo(next >= CYCLES_PER_SET ? 'long' : 'short')
    } else {
      if (m === 'long') setCycles(0)
      goTo('focus')
    }
  }, [goTo])

  // Relógio: calcula pelo horário final, então não "atrasa" com a aba em segundo plano
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      if (!endAt.current) return
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) finish()
    }, 250)
    return () => clearInterval(id)
  }, [running, finish])

  // Mostra o tempo na aba do navegador enquanto roda
  useEffect(() => {
    if (!running) return undefined
    document.title = `${fmt(remaining)} · ${MODE_LABEL[mode]} — margem`
    return () => { document.title = 'margem — Agenda acadêmica' }
  }, [running, remaining, mode])

  const start = useCallback((currentTarget) => {
    if (currentTarget) setTarget(currentTarget)
    endAt.current = Date.now() + remaining * 1000
    if (mode === 'focus' && !startedAt.current) startedAt.current = new Date().toISOString()
    setRunning(true)
  }, [remaining, mode])

  const pause = useCallback(() => {
    if (endAt.current) setRemaining(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)))
    endAt.current = 0
    setRunning(false)
  }, [])

  const reset = useCallback(() => goTo(mode), [goTo, mode])
  const selectMode = useCallback((m) => goTo(m), [goTo])

  // Pular sem contar como ciclo concluído
  const skip = useCallback(() => {
    if (mode === 'focus') goTo('short')
    else { if (mode === 'long') setCycles(0); goTo('focus') }
  }, [mode, goTo])

  const value = useMemo(() => ({
    mode, remaining, running, cycles, target, setTarget, total: DURATIONS[mode],
    start, pause, reset, selectMode, skip,
  }), [mode, remaining, running, cycles, target, start, pause, reset, selectMode, skip])

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext)
  if (!ctx) throw new Error('usePomodoro deve ser usado dentro de PomodoroProvider')
  return ctx
}
