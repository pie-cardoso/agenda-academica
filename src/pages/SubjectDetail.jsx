import { useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Plus, Upload, Play, CalendarDays, Clock } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import FileItem from '../components/subjects/FileItem.jsx'
import LinkItem from '../components/subjects/LinkItem.jsx'
import LinkFormModal from '../components/subjects/LinkFormModal.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { extOf } from '../services/formatters.js'
import { formatSchedule, getStatus, parseDue, daysUntil, formatDayMonth, formatHour } from '../services/dateUtils.js'

const SECTIONS = [
  { id: 'arquivos', label: 'Arquivos' },
  { id: 'links', label: 'Links' },
  { id: 'tarefas', label: 'Tarefas' },
]
const TASK_TABS = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'done', label: 'Concluídas' },
  { id: 'late', label: 'Atrasadas' },
]
const MAX_FILE_BYTES = 20 * 1024 * 1024

export default function SubjectDetail() {
  const { id, tab = 'arquivos' } = useParams()
  const navigate = useNavigate()
  const { subjects, tasks, addFile, removeFile, addLink, removeLink } = useAppData()
  const subject = subjects.find((s) => s.id === id)

  const [openFile, setOpenFile] = useState(null)
  const [openLink, setOpenLink] = useState(subject?.links?.[0]?.id ?? null)
  const [addingLink, setAddingLink] = useState(false)
  const [fileError, setFileError] = useState('')
  const [taskTab, setTaskTab] = useState('todo')
  const fileInput = useRef(null)

  const subjectTasks = useMemo(() => tasks.filter((t) => t.subjectId === id), [tasks, id])
  const open = subjectTasks.filter((t) => !t.done)
  const counts = { todo: open.length, done: subjectTasks.length - open.length, late: open.filter((t) => getStatus(t) === 'late').length }
  const visibleTasks = useMemo(() => {
    const byDue = (a, b) => parseDue(a) - parseDue(b)
    const list = taskTab === 'done' ? subjectTasks.filter((t) => t.done) : taskTab === 'late' ? open.filter((t) => getStatus(t) === 'late') : open
    return [...list].sort(byDue)
  }, [subjectTasks, open, taskTab])

  if (!subject) return <Navigate to="/materias" replace />
  if (!SECTIONS.some((s) => s.id === tab)) return <Navigate to={`/materias/${id}`} replace />

  const files = subject.files ?? []
  const links = subject.links ?? []
  const exam = subject.exam
  const examDays = exam ? daysUntil(exam.date) : null

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_FILE_BYTES) { setFileError('O arquivo passa de 20 MB.'); return }
    setFileError('')
    // Só os metadados são salvos (o localStorage é pequeno); a prévia é simulada.
    addFile(subject.id, { id: `f${Date.now()}`, name: file.name, type: extOf(file.name), size: file.size, addedAt: new Date().toISOString() })
  }

  const confirmRemove = (label, fn) => window.confirm(`Remover ${label}?`) && fn()

  return (
    <>
      <PageHeader back="/materias" eyebrow="Seu espaço de aprendizado" title={subject.name} />

      <div className={`subject-header tone--${subject.color}`}>
        <span className="subject-header__symbol" aria-hidden="true">{subject.symbol ?? subject.name.charAt(0)}</span>
        <div>
          <p className="subject-header__prof">{subject.professor || 'Professor(a) não informado(a)'}</p>
          <p className="subject-header__meta">{formatSchedule(subject)}{subject.room ? ` · ${subject.room}` : ''}</p>
        </div>
      </div>

      <Tabs tabs={SECTIONS} value={tab} onChange={(t) => navigate(`/materias/${id}/${t}`, { replace: true })} label="Seções da matéria" />

      {tab === 'arquivos' && (
        <section className="detail-section">
          <div className="section-head"><h2 className="section-head__title">Seu material</h2><span className="section-head__link">{files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}</span></div>
          {files.length === 0 ? (
            <EmptyState title="Nenhum arquivo ainda">Guarde resumos, listas e fotos de caderno aqui.</EmptyState>
          ) : (
            <div className="item-list">
              {files.map((f) => (
                <FileItem key={f.id} file={f} expanded={openFile === f.id}
                  onToggle={() => setOpenFile(openFile === f.id ? null : f.id)}
                  onRemove={() => confirmRemove(`"${f.name}"`, () => removeFile(subject.id, f.id))} />
              ))}
            </div>
          )}
          <input ref={fileInput} type="file" hidden accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.ppt,.pptx,.txt" onChange={onPickFile} />
          <button type="button" className="btn btn--primary fab" onClick={() => fileInput.current?.click()}><Upload size={16} /> Adicionar arquivo</button>
          {fileError && <p className="field__error" role="alert" style={{ textAlign: 'center', marginTop: 8 }}>{fileError}</p>}
          <p className="detail-note">PDF, imagens e documentos · até 20 MB</p>
        </section>
      )}

      {tab === 'links' && (
        <section className="detail-section">
          <div className="section-head"><h2 className="section-head__title">Boas referências</h2><span className="section-head__link">{links.length} {links.length === 1 ? 'link' : 'links'}</span></div>
          {links.length === 0 ? (
            <EmptyState title="Nenhum link ainda">Salve sites e vídeos que ajudam a entender a matéria.</EmptyState>
          ) : (
            <div className="item-list">
              {links.map((l) => (
                <LinkItem key={l.id} link={l} expanded={openLink === l.id}
                  onToggle={() => setOpenLink(openLink === l.id ? null : l.id)}
                  onRemove={() => confirmRemove(`"${l.title}"`, () => removeLink(subject.id, l.id))} />
              ))}
            </div>
          )}
          <button type="button" className="btn btn--primary fab" onClick={() => setAddingLink(true)}><Plus size={16} /> Adicionar link</button>
          <p className="detail-note">Sites e vídeos que ajudam a conectar as ideias</p>
          {addingLink && <LinkFormModal onClose={() => setAddingLink(false)} onSubmit={(l) => { addLink(subject.id, l); setOpenLink(l.id); setAddingLink(false) }} />}
        </section>
      )}

      {tab === 'tarefas' && (
        <section className="detail-section">
          <div className="section-head">
            <h2 className="section-head__title">Tarefas da matéria</h2>
            <button type="button" className="pill-btn" onClick={() => navigate(`/tarefas/nova?materia=${subject.id}`)}><Plus size={12} /> To-do</button>
          </div>
          <Tabs tabs={TASK_TABS} value={taskTab} onChange={setTaskTab} label="Filtrar tarefas da matéria" />
          <p className="section-count">{counts.todo} a fazer · {counts.done} {counts.done === 1 ? 'concluída' : 'concluídas'} · {counts.late} {counts.late === 1 ? 'atrasada' : 'atrasadas'}</p>
          <TaskList tasks={visibleTasks} emptyTitle="Nada por aqui" emptyText={taskTab === 'late' ? 'Nenhuma tarefa atrasada nesta matéria.' : 'Crie uma tarefa com o botão To-do.'} />

          {exam && examDays >= 0 && (
            <div className="exam">
              <div className="exam__top">
                <span className="exam__tag">Próxima prova</span>
                <span className="exam__when">{examDays === 0 ? 'Hoje' : examDays === 1 ? 'Amanhã' : `Em ${examDays} dias`}</span>
              </div>
              <h3 className="exam__title">{exam.title}</h3>
              <p className="exam__meta"><CalendarDays size={13} /> {formatDayMonth(exam.date + 'T12:00:00')} · {formatHour(exam.time)}{exam.room ? ` · ${exam.room}` : ''}</p>
              {exam.description && <p className="exam__text">{exam.description}</p>}
            </div>
          )}

          <button type="button" className="btn btn--primary fab" onClick={() => navigate(`/foco?materia=${subject.id}`)}><Play size={15} /> Estudar {subject.name}</button>
        </section>
      )}
    </>
  )
}
