import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import TaskForm from '../components/tasks/TaskForm.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { getStatus, formatRemaining } from '../services/dateUtils.js'

export default function TaskEdit() {
  const { id } = useParams()
  const { tasks, updateTask, deleteTask } = useAppData()
  const navigate = useNavigate()
  const task = tasks.find((t) => t.id === id)

  if (!task) return <Navigate to="/tarefas" replace />

  const remaining = !task.done && formatRemaining(task)

  const handleDelete = () => {
    if (window.confirm(`Excluir "${task.title}"? Essa ação não pode ser desfeita.`)) {
      deleteTask(task.id)
      navigate('/tarefas')
    }
  }

  return (
    <>
      <PageHeader back="/tarefas" eyebrow="Editar tarefa" title="Ajuste seu plano." />

      <div className="edit-meta">
        <StatusBadge status={getStatus(task)} />
        {remaining && <span className="edit-meta__left">Faltam {remaining}</span>}
      </div>

      <TaskForm
        key={task.id}
        mode="edit"
        initial={task}
        onSubmit={(values) => { updateTask(task.id, values); navigate('/tarefas') }}
      >
        <button type="button" className="btn btn--danger" onClick={handleDelete}>
          <Trash2 size={16} /> Excluir tarefa
        </button>
        <p className="form__note" style={{ justifyContent: 'center' }}>Você confirma a exclusão antes de remover a tarefa.</p>
      </TaskForm>
    </>
  )
}
