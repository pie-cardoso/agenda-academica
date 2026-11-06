import { NavLink } from 'react-router-dom'
import { Home, ListChecks, FolderOpen, CalendarDays, Timer } from 'lucide-react'

const ITEMS = [
  { to: '/',         label: 'Início',   icon: Home,         end: true },
  { to: '/tarefas',  label: 'Tarefas',  icon: ListChecks },
  { to: '/materias', label: 'Matérias', icon: FolderOpen },
  { to: '/agenda',   label: 'Agenda',   icon: CalendarDays },
  { to: '/foco',     label: 'Foco',     icon: Timer },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}>
          <span className="bottom-nav__icon"><Icon size={18} strokeWidth={1.8} /></span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
