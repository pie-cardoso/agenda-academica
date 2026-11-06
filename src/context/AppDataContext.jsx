import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loadData, saveData } from '../services/storage.js'
import { buildSeedData } from '../services/seedData.js'

const AppDataContext = createContext(null)

// Dados salvos em etapas anteriores podem não ter campos novos (arquivos, links, horários...).
// Completa as matérias de exemplo com o que faltar, sem sobrescrever o que o usuário já tem.
function initialData() {
  const saved = loadData()
  const seed = buildSeedData()
  if (!saved) return seed
  const subjects = (saved.subjects ?? seed.subjects).map((s) => {
    const base = seed.subjects.find((x) => x.id === s.id) ?? { files: [], links: [], exam: null }
    return { ...base, ...s }
  })
  // Agenda (etapa 4): popula eventos e registros de estudo de exemplo uma única vez
  const needsAgenda = !saved.agendaSeeded
  return {
    ...seed, ...saved, subjects,
    events: needsAgenda ? seed.events : saved.events ?? [],
    focusSessions: needsAgenda ? seed.focusSessions : saved.focusSessions ?? [],
    agendaSeeded: true,
  }
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(initialData)

  useEffect(() => { saveData(data) }, [data])

  // ----- Tarefas -----
  const addTask = useCallback((task) => {
    const newTask = { ...task, id: `t${Date.now()}`, done: false }
    setData((d) => ({ ...d, tasks: [...d.tasks, newTask] }))
    return newTask
  }, [])

  const updateTask = useCallback((id, changes) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => {
        if (t.id !== id) return t
        const next = { ...t, ...changes }
        if (next.done && !t.done) next.doneAt = new Date().toISOString()
        if (!next.done) delete next.doneAt
        return next
      }),
    }))
  }, [])

  const toggleTask = useCallback((id) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => {
        if (t.id !== id) return t
        return t.done
          ? (({ doneAt, ...rest }) => ({ ...rest, done: false }))(t)
          : { ...t, done: true, doneAt: new Date().toISOString() }
      }),
    }))
  }, [])

  const deleteTask = useCallback((id) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }))
  }, [])

  // ----- Matérias -----
  const patchSubject = (subjectId, fn) =>
    setData((d) => ({ ...d, subjects: d.subjects.map((s) => (s.id === subjectId ? fn(s) : s)) }))

  const addSubject = useCallback((subject) => {
    const created = { files: [], links: [], exam: null, ...subject, id: `m${Date.now()}` }
    setData((d) => ({ ...d, subjects: [...d.subjects, created] }))
    return created
  }, [])

  const addFile = useCallback((subjectId, file) => {
    patchSubject(subjectId, (s) => ({ ...s, files: [...(s.files ?? []), file] }))
  }, [])
  const removeFile = useCallback((subjectId, fileId) => {
    patchSubject(subjectId, (s) => ({ ...s, files: s.files.filter((f) => f.id !== fileId) }))
  }, [])
  const addLink = useCallback((subjectId, link) => {
    patchSubject(subjectId, (s) => ({ ...s, links: [...(s.links ?? []), link] }))
  }, [])
  const removeLink = useCallback((subjectId, linkId) => {
    patchSubject(subjectId, (s) => ({ ...s, links: s.links.filter((l) => l.id !== linkId) }))
  }, [])

  // ----- Eventos da agenda -----
  const addEvent = useCallback((event) => {
    const created = { ...event, id: `e${Date.now()}` }
    setData((d) => ({ ...d, events: [...(d.events ?? []), created] }))
    return created
  }, [])
  const removeEvent = useCallback((id) => {
    setData((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) }))
  }, [])

  // ----- Registros de estudo (Foco) -----
  const addFocusSession = useCallback((session) => {
    const created = { ...session, id: `s${Date.now()}` }
    setData((d) => ({ ...d, focusSessions: [...(d.focusSessions ?? []), created] }))
    return created
  }, [])

  const value = useMemo(
    () => ({ ...data, addTask, updateTask, toggleTask, deleteTask, addSubject, addFile, removeFile, addLink, removeLink, addEvent, removeEvent, addFocusSession }),
    [data, addTask, updateTask, toggleTask, deleteTask, addSubject, addFile, removeFile, addLink, removeLink],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData deve ser usado dentro de AppDataProvider')
  return ctx
}
