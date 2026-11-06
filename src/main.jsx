import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppDataProvider } from './context/AppDataContext.jsx'
import { PomodoroProvider } from './context/PomodoroContext.jsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/ui.css'
import './styles/tasks.css'
import './styles/pages.css'
import './styles/subjects.css'
import './styles/agenda.css'
import './styles/focus.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppDataProvider>
        <PomodoroProvider>
          <App />
        </PomodoroProvider>
      </AppDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
