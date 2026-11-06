import { toISODate, getStatus, formatHour, formatRemaining, addDays } from './dateUtils.js'

export const KIND_LABEL = { aula: 'Aula', entrega: 'Entrega', prova: 'Prova', apresentacao: 'Apresentação', estudo: 'Estudo' }

// Tipos que aparecem como marca no calendário (aulas ficam só na agenda do dia).
// A ordem define qual cor "pinta" o dia quando há mais de um evento.
export const MARK_KINDS = ['prova', 'apresentacao', 'entrega', 'estudo']

const pad = (n) => String(n).padStart(2, '0')

export function isoToDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function shiftMonth(date, dir) {
  const target = new Date(date.getFullYear(), date.getMonth() + dir, 1)
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(date.getDate(), last))
  return target
}

/** Células do mês (null = espaço antes do dia 1), semana começando no domingo. */
export function monthCells(date) {
  const y = date.getFullYear()
  const m = date.getMonth()
  const lead = new Date(y, m, 1).getDay()
  const total = new Date(y, m + 1, 0).getDate()
  return [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => toISODate(new Date(y, m, i + 1)))]
}

export function weekDates(date) {
  const start = addDays(-date.getDay(), date)
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(i, start)))
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function monthTitle(date) {
  return `${capitalize(date.toLocaleDateString('pt-BR', { month: 'long' }))} ${date.getFullYear()}`
}

export function weekdayLong(date) {
  return capitalize(date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0])
}

export function weekdayShort(date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()
}

export function dayHeading(iso, todayIso) {
  const d = isoToDate(iso)
  const month = d.toLocaleDateString('pt-BR', { month: 'long' })
  const prefix = iso === todayIso ? 'Hoje' : weekdayLong(d)
  return `${prefix}, ${d.getDate()} de ${month}`
}

/** Todos os eventos de um dia, ordenados por horário. */
export function getEventsForDate(iso, data, now = new Date()) {
  const { subjects = [], tasks = [], events = [], focusSessions = [] } = data
  const date = isoToDate(iso)
  const subjectOf = (id) => subjects.find((s) => s.id === id)
  const out = []

  // Aulas (vêm dos dias e horários de cada matéria)
  for (const s of subjects) {
    if (!s.start || !s.days?.includes(date.getDay())) continue
    out.push({
      id: `aula-${s.id}-${iso}`, kind: 'aula', name: s.name, subjectName: s.name,
      title: `Aula de ${s.name}`, time: s.start,
      subtitle: [s.end && `até ${formatHour(s.end)}`, s.professor, s.room].filter(Boolean).join(' · '),
      href: `/materias/${s.id}`,
    })
  }

  // Entregas (vêm das tarefas)
  for (const t of tasks) {
    if (t.dueDate !== iso) continue
    const subject = subjectOf(t.subjectId)
    const status = getStatus(t, now)
    const note = t.done ? 'concluída' : status === 'late' ? 'atrasada' : `faltam ${formatRemaining(t, now)}`
    out.push({
      id: `entrega-${t.id}`, kind: 'entrega', name: t.title, subjectName: subject?.name,
      title: `Entregar ${t.title}`, time: t.dueTime || '23:59',
      subtitle: [subject?.name, note].filter(Boolean).join(' · '),
      done: t.done, href: `/tarefas/${t.id}/editar`,
    })
  }

  // Provas (vêm da matéria)
  for (const s of subjects) {
    if (s.exam?.date !== iso) continue
    out.push({
      id: `prova-${s.id}`, kind: 'prova', name: s.exam.title, subjectName: s.name,
      title: `Prova — ${s.exam.title}`, time: s.exam.time || '08:00',
      subtitle: [s.name, s.exam.room].filter(Boolean).join(' · '),
      href: `/materias/${s.id}/tarefas`,
    })
  }

  // Eventos criados pelo usuário (prova / apresentação)
  for (const e of events) {
    if (e.date !== iso) continue
    const subject = subjectOf(e.subjectId)
    out.push({
      id: e.id, kind: e.type, name: e.title, subjectName: subject?.name,
      title: `${KIND_LABEL[e.type]} — ${e.title}`, time: e.time || '08:00',
      subtitle: subject?.name ?? '', removableId: e.id,
    })
  }

  // Registros de estudo (sessões de foco), agrupados por matéria
  const groups = {}
  for (const f of focusSessions) {
    if (f.mode && f.mode !== 'focus') continue
    const started = new Date(f.startedAt)
    if (toISODate(started) !== iso) continue
    const key = f.subjectId ?? 'livre'
    ;(groups[key] ??= []).push({ ...f, started })
  }
  for (const [key, list] of Object.entries(groups)) {
    const first = list.reduce((a, b) => (a.started < b.started ? a : b))
    const minutes = list.reduce((sum, f) => sum + (f.minutes || 0), 0)
    const subject = subjectOf(key)
    out.push({
      id: `estudo-${key}-${iso}`, kind: 'estudo', name: subject?.name ?? 'Estudo livre', subjectName: subject?.name,
      title: `Estudo de ${subject?.name ?? 'foco livre'}`, time: `${pad(first.started.getHours())}:${pad(first.started.getMinutes())}`,
      subtitle: `${list.length} ${list.length === 1 ? 'ciclo concluído' : 'ciclos concluídos'} · ${minutes} min registrados`,
      done: true,
    })
  }

  return out.sort((a, b) => a.time.localeCompare(b.time))
}

/** Tipos marcados no dia, na ordem de prioridade. */
export function markKinds(events) {
  return MARK_KINDS.filter((k) => events.some((e) => e.kind === k))
}
