import { Link } from 'react-router-dom'
import { Check, Pencil, Trash2, RotateCcw } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge.jsx'
import { getStatus, formatDueShort } from '../../services/dateUtils.js'

export default function TaskCard({ task, subject, onToggle, onDelete, compact = false }) {
  const status = getStatus(task)
  const dueClass = status === 'late' ? ' is-late' : status === 'today' ? ' is-today' : ''

  const handleDelete = () => {
    if (window.confirm(`Excluir "${task.title}"? Essa ação não pode ser desfeita.`)) onDelete(task.id)
  }

  return (
    <article className={`task-card${compact ? ' task-card--compact' : ''}${task.done ? ' is-done' : ''}`}>
      <div className="task-card__main">
        <button
          type="button"
          className={`check${task.done ? ' is-done' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.done ? 'Reabrir tarefa' : 'Concluir tarefa'}
        >
          {task.done && <Check size={13} strokeWidth={3} />}
        </button>
        <div className="task-card__body">
          <h3 className="task-card__title">{task.title}</h3>
          <p className="task-card__subject">{subject?.name ?? 'Sem matéria'}</p>
          <div className="task-card__meta">
            <StatusBadge status={status} />
            <span className={`task-card__due${dueClass}`}>
              {task.done ? `Feita em ${new Date(task.doneAt ?? Date.now()).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')}` : formatDueShort(task)}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="task-card__actions">
          <button type="button" className="task-action" onClick={() => onToggle(task.id)}>
            {task.done ? <><RotateCcw size={13} /> Reabrir</> : <><Check size={13} /> Concluir</>}
          </button>
          <Link to={`/tarefas/${task.id}/editar`} className="task-action"><Pencil size={13} /> Editar</Link>
          <button type="button" className="task-action task-action--danger" onClick={handleDelete}>
            <Trash2 size={13} /> Excluir
          </button>
        </div>
      )}
    </article>
  )
}
