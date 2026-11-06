const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MONTHS_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

const pad = (n) => String(n).padStart(2, '0')

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(days, base = new Date()) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Combina "YYYY-MM-DD" + "HH:mm" em um Date local. */
export function parseDue(task) {
  const [y, m, d] = task.dueDate.split('-').map(Number)
  const [hh, mm] = (task.dueTime || '23:59').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export function dayDiff(task, now = new Date()) {
  const due = startOfDay(parseDue(task))
  return Math.round((due - startOfDay(now)) / 86400000)
}

/** Status calculado: done | late | today | soon | pending */
export function getStatus(task, now = new Date()) {
  if (task.done) return 'done'
  if (parseDue(task) < now) return 'late'
  const diff = dayDiff(task, now)
  if (diff === 0) return 'today'
  if (diff === 1) return 'soon'
  return 'pending'
}

export const STATUS_LABEL = {
  done: 'Concluída',
  late: 'Atrasada',
  today: 'Vence hoje',
  soon: 'Vence amanhã',
  pending: 'Pendente',
}

export function formatHour(time = '00:00') {
  const [h, m] = time.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

export function formatDueShort(task, now = new Date()) {
  const diff = dayDiff(task, now)
  const [, m, d] = task.dueDate.split('-').map(Number)
  const hour = formatHour(task.dueTime)
  if (diff === 0) return `Hoje, ${hour}`
  if (diff === 1) return `Amanhã, ${hour}`
  return `${d} ${MONTHS_SHORT[m - 1]}, ${hour}`
}

/** "6h19", "2 dias", "45 min" — tempo até o prazo. */
export function formatRemaining(task, now = new Date()) {
  const ms = parseDue(task) - now
  if (ms <= 0) return null
  const totalMin = Math.floor(ms / 60000)
  const days = Math.floor(totalMin / 1440)
  if (days >= 1) return `${days} ${days === 1 ? 'dia' : 'dias'}`
  const h = Math.floor(totalMin / 60)
  const min = totalMin % 60
  return h > 0 ? `${h}h${pad(min)}` : `${min} min`
}

/** Contagem curta para o radar: "1d 6h", "6h19", "45 min". */
export function formatCountdown(task, now = new Date()) {
  const ms = parseDue(task) - now
  if (ms <= 0) return null
  const totalMin = Math.floor(ms / 60000)
  const d = Math.floor(totalMin / 1440)
  const h = Math.floor((totalMin % 1440) / 60)
  const m = totalMin % 60
  if (d >= 1) return h ? `${d}d ${h}h` : `${d}d`
  if (h >= 1) return `${h}h${pad(m)}`
  return `${m} min`
}

export function formatLongDate(date = new Date()) {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS_LONG[date.getMonth()]} de ${date.getFullYear()}`
}

export function formatShortDate(date = new Date()) {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

export function monthShort(isoDate) {
  return MONTHS_SHORT[Number(isoDate.split('-')[1]) - 1]
}

export function dayOfMonth(isoDate) {
  return Number(isoDate.split('-')[2])
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

// ---------- Matérias: horários de aula ----------
const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
export const WEEKDAY_CHIPS = [
  { value: 1, label: 'Seg' }, { value: 2, label: 'Ter' }, { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' }, { value: 5, label: 'Sex' }, { value: 6, label: 'Sáb' },
]

/** "Seg e qua · 10h–11h40" */
export function formatSchedule(subject) {
  const days = [...(subject.days ?? [])].sort().map((d) => WEEKDAYS_SHORT[d])
  if (days.length === 0) return 'Horário a definir'
  const list = days.length === 1 ? days[0] : `${days.slice(0, -1).join(', ')} e ${days[days.length - 1]}`
  const label = list.charAt(0).toUpperCase() + list.slice(1)
  return subject.start && subject.end ? `${label} · ${formatHour(subject.start)}–${formatHour(subject.end)}` : label
}

/** Próxima aula a partir de agora (considera hoje se ainda não começou). */
export function nextClass(subjects, now = new Date()) {
  let best = null
  for (const s of subjects) {
    if (!s.days?.length || !s.start) continue
    const [h, m] = s.start.split(':').map(Number)
    for (let offset = 0; offset < 8; offset++) {
      const d = addDays(offset, now)
      if (!s.days.includes(d.getDay())) continue
      const at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m)
      if (at <= now) continue
      if (!best || at < best.at) best = { subject: s, at, offset }
      break
    }
  }
  return best
}

export function weekdayName(date) {
  return WEEKDAYS[date.getDay()]
}

export function formatDayMonth(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')
}

export function daysUntil(isoDate, now = new Date()) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return Math.round((new Date(y, m - 1, d) - startOfDay(now)) / 86400000)
}
