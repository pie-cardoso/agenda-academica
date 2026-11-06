import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Bell } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import SubjectCard from '../components/subjects/SubjectCard.jsx'
import SubjectFormModal from '../components/subjects/SubjectFormModal.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAppData } from '../context/AppDataContext.jsx'
import { normalize } from '../services/formatters.js'
import { nextClass, formatHour, weekdayName } from '../services/dateUtils.js'

export default function Subjects() {
  const { subjects, tasks, addSubject } = useAppData()
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    const q = normalize(query)
    return q ? subjects.filter((s) => normalize(`${s.name} ${s.professor}`).includes(q)) : subjects
  }, [subjects, query])

  const next = nextClass(subjects)
  const when = next && (next.offset === 0 ? 'hoje' : next.offset === 1 ? 'amanhã' : weekdayName(next.at))

  return (
    <>
      <PageHeader
        eyebrow={`${subjects.length} ${subjects.length === 1 ? 'matéria' : 'matérias'} · semestre 2026.1`}
        title={<>Seu semestre,<br />em boas pastas.</>}
        action={<button type="button" className="icon-btn icon-btn--filled" onClick={() => setCreating(true)} aria-label="Nova matéria"><Plus size={18} /></button>}
      />

      <label className="search">
        <Search size={15} />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Encontre sua matéria" aria-label="Buscar matéria" />
      </label>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhuma matéria encontrada">Tente outro nome ou crie uma nova com o botão +.</EmptyState>
      ) : (
        <div className="subject-grid">
          {filtered.map((s) => <SubjectCard key={s.id} subject={s} tasks={tasks.filter((t) => t.subjectId === s.id)} />)}
        </div>
      )}

      {next && !query && (
        <Link to={`/materias/${next.subject.id}`} className="class-note">
          <Bell size={16} />
          <span>
            <strong>{next.offset === 0 ? 'Nos vemos na aula!' : 'Próxima aula'}</strong>
            {next.subject.name} começa {when} às {formatHour(next.subject.start)}{next.subject.room ? `, em ${next.subject.room}` : ''}.
          </span>
        </Link>
      )}

      {creating && <SubjectFormModal onClose={() => setCreating(false)} onSubmit={(v) => { addSubject(v); setCreating(false) }} />}
    </>
  )
}
