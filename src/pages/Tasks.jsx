import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowDownWideNarrow } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { getStatus, parseDue, formatShortDate } from '../services/dateUtils.js'

const TABS = [
  { id: 'all', label: 'Todas' },
  { id: 'todo', label: 'A Fazer' },
  { id: 'done', label: 'Concluídas' },
  { id: 'late', label: 'Atrasadas' },
]

const FILTERS = {
  all: () => true,
  todo: (t) => !t.done,
  done: (t) => t.done,
  late: (t) => getStatus(t) === 'late',
}

export default function Tasks() {
  const { tasks } = useAppData()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')

  const visible = useMemo(
    () => tasks.filter(FILTERS[tab]).sort((a, b) => parseDue(a) - parseDue(b)),
    [tasks, tab],
  )
  const subjectCount = new Set(tasks.map((t) => t.subjectId)).size

  return (
    <>
      <PageHeader eyebrow={`Suas tarefas · ${formatShortDate()}`} title="Tire do papel." />

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Filtrar tarefas" />

      <div className="list-toolbar">
        <span>{tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'} em {subjectCount} {subjectCount === 1 ? 'matéria' : 'matérias'}</span>
        <span className="list-toolbar__sort"><ArrowDownWideNarrow size={12} /> Por prazo</span>
      </div>

      <TaskList
        tasks={visible}
        emptyTitle="Nenhuma tarefa aqui"
        emptyText="Toque em “To-do” para criar a primeira."
      />

      <button type="button" className="btn btn--primary fab" onClick={() => navigate('/tarefas/nova')}>
        <Plus size={16} /> To-do
      </button>
    </>
  )
}
