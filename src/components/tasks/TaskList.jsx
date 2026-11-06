import TaskCard from './TaskCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'

export default function TaskList({ tasks, compact, emptyTitle = 'Nada por aqui', emptyText = 'Quando houver tarefas neste filtro, elas aparecem aqui.' }) {
  const { subjects, toggleTask, deleteTask } = useAppData()

  if (tasks.length === 0) return <EmptyState title={emptyTitle}>{emptyText}</EmptyState>

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          compact={compact}
          subject={subjects.find((s) => s.id === task.subjectId)}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  )
}
