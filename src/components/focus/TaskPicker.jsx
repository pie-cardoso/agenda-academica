import { ChevronDown } from 'lucide-react'

export default function TaskPicker({ tasks, subjects, target, onChange }) {
  const task = tasks.find((t) => t.id === target.taskId)
  const subject = subjects.find((s) => s.id === (task?.subjectId ?? target.subjectId))

  return (
    <div className="task-picker">
      <span className="task-picker__text">
        <span className="task-picker__subject">{subject?.name ?? 'Foco livre'}</span>
        <span className="task-picker__title">{task ? task.title : 'Sem tarefa específica'}</span>
      </span>
      <ChevronDown size={16} />
      <select className="task-picker__select" aria-label="Tarefa em foco" value={target.taskId} onChange={(e) => onChange(e.target.value)}>
        <option value="">Foco livre (sem tarefa)</option>
        {tasks.map((t) => <option key={t.id} value={t.id}>{t.title} — {subjects.find((s) => s.id === t.subjectId)?.name ?? 'Sem matéria'}</option>)}
      </select>
    </div>
  )
}
