import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
  const { pathname } = useLocation()

  // Volta ao topo ao trocar de tela
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="app">
      <main className="app__content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
