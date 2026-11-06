import { useNavigate, useSearchParams } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import TaskForm from '../components/tasks/TaskForm.jsx'
import { useAppData } from '../context/AppDataContext.jsx'

export default function TaskCreate() {
  const { addTask } = useAppData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const subjectId = params.get('materia') ?? ''

  return (
    <>
      <PageHeader back={subjectId ? `/materias/${subjectId}/tarefas` : '/tarefas'} eyebrow="Nova tarefa" title="Um novo passo." />

      <div className="hint-card">
        <span className="hint-card__icon"><NotebookPen size={18} /></span>
        <div>
          <p className="hint-card__title">Da cabeça para o papel.</p>
          <p className="hint-card__text">Organize agora. Respire mais leve depois.</p>
        </div>
      </div>

      <TaskForm
        mode="create"
        initial={{ subjectId }}
        onSubmit={(values) => { addTask(values); navigate(subjectId ? `/materias/${subjectId}/tarefas` : '/tarefas') }}
        onCancel={() => navigate(-1)}
      />
    </>
  )
}
