import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Home from './pages/Home.jsx'
import Tasks from './pages/Tasks.jsx'
import TaskCreate from './pages/TaskCreate.jsx'
import TaskEdit from './pages/TaskEdit.jsx'
import Subjects from './pages/Subjects.jsx'
import SubjectDetail from './pages/SubjectDetail.jsx'
import Agenda from './pages/Agenda.jsx'
import Focus from './pages/Focus.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="tarefas" element={<Tasks />} />
        <Route path="tarefas/nova" element={<TaskCreate />} />
        <Route path="tarefas/:id/editar" element={<TaskEdit />} />
        <Route path="materias" element={<Subjects />} />
        <Route path="materias/:id/:tab?" element={<SubjectDetail />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="foco" element={<Focus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
