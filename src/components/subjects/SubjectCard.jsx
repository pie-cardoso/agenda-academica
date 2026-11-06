import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { formatSchedule, getStatus } from '../../services/dateUtils.js'

const TERM = '2026.1'

export default function SubjectCard({ subject, tasks }) {
  const open = tasks.filter((t) => !t.done)
  const late = open.filter((t) => getStatus(t) === 'late').length

  return (
    <Link to={`/materias/${subject.id}`} className={`subject-card tone--${subject.color}`}>
      <span className="subject-card__term">{TERM}</span>
      <div className="subject-card__top">
        <span className="subject-card__symbol" aria-hidden="true">{subject.symbol ?? subject.name.charAt(0)}</span>
        <ArrowUpRight size={14} />
      </div>
      <h3 className="subject-card__name">{subject.name}</h3>
      <p className="subject-card__prof">{subject.professor}</p>
      <p className="subject-card__line"><Clock size={11} /> {formatSchedule(subject)}</p>
      {subject.room && <p className="subject-card__line"><MapPin size={11} /> {subject.room}</p>}
      <div className="subject-card__foot">
        <span>{open.length === 0 ? 'Sem tarefas' : `${open.length} ${open.length === 1 ? 'tarefa' : 'tarefas'}`}</span>
        {late > 0 && <span className="subject-card__late">{late} {late === 1 ? 'atrasada' : 'atrasadas'}</span>}
      </div>
    </Link>
  )
}
