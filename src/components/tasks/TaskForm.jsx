import { useState } from 'react'
import { Plus, Check, Info } from 'lucide-react'
import Field from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'

const EMPTY = { title: '', subjectId: '', description: '', dueDate: '', dueTime: '', done: false }

/** Formulário compartilhado por "Nova tarefa" e "Editar tarefa". */
export default function TaskForm({ initial = EMPTY, mode = 'create', onSubmit, onCancel, children }) {
  const { subjects } = useAppData()
  const [values, setValues] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!values.title.trim()) er.title = 'Dê um nome para a tarefa.'
    if (!values.subjectId) er.subjectId = 'Escolha uma matéria.'
    if (!values.dueDate) er.dueDate = 'Informe o prazo.'
    if (!values.dueTime) er.dueTime = 'Informe o horário.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() })
  }

  const cls = (id) => `field__control${errors[id] ? ' has-error' : ''}`

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Field error={errors.title} id="title" label="Título" required>
        <input id="title" className={cls('title')} value={values.title} onChange={set('title')} placeholder="O que você precisa fazer?" />
      </Field>

      <Field error={errors.subjectId} id="subjectId" label="Disciplina" required>
        <select id="subjectId" className={cls('subjectId')} value={values.subjectId} onChange={set('subjectId')}>
          <option value="">Selecione uma matéria</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>

      <Field error={errors.description} id="description" label="Descrição">
        <textarea id="description" className="field__control" value={values.description} onChange={set('description')} placeholder="Anote instruções, páginas ou ideias…" />
      </Field>

      <div className="field-row">
        <Field error={errors.dueDate} id="dueDate" label="Data" required>
          <input id="dueDate" type="date" className={cls('dueDate')} value={values.dueDate} onChange={set('dueDate')} />
        </Field>
        <Field error={errors.dueTime} id="dueTime" label="Horário" required>
          <input id="dueTime" type="time" className={cls('dueTime')} value={values.dueTime} onChange={set('dueTime')} />
        </Field>
      </div>

      {mode === 'create' ? (
        <p className="form__note"><Info size={13} style={{ flex: 'none' }} /> O prazo aparece na sua lista e no calendário. Campos com * são obrigatórios.</p>
      ) : (
        <label className="checkbox-row">
          <input type="checkbox" checked={values.done} onChange={set('done')} /> Marcar como concluída
        </label>
      )}

      <button type="submit" className="btn btn--primary">
        {mode === 'create' ? <><Plus size={16} /> Criar tarefa</> : <><Check size={16} /> Salvar alterações</>}
      </button>
      {mode === 'create' && <button type="button" className="btn btn--soft" onClick={onCancel}>Cancelar</button>}
      {children}
    </form>
  )
}
