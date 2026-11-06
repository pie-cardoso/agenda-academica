import { Check } from 'lucide-react'
import { CYCLES_PER_SET } from '../../context/PomodoroContext.jsx'

export default function CycleDots({ cycles, mode }) {
  return (
    <ol className="cycle-dots" aria-label={`${cycles} de ${CYCLES_PER_SET} ciclos concluídos`}>
      {Array.from({ length: CYCLES_PER_SET }, (_, i) => {
        const done = i < cycles
        const current = !done && i === cycles && mode === 'focus'
        return (
          <li key={i} className={`cycle-dots__item${done ? ' is-done' : ''}${current ? ' is-current' : ''}`}>
            {done ? <Check size={11} strokeWidth={3} /> : i + 1}
          </li>
        )
      })}
    </ol>
  )
}
