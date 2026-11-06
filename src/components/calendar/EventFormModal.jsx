import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Field from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'

const TYPES = [{ id: 'prova', label: 'Prova' }, { id: 'apresentacao', label: 'Apresentação' }]

export default function EventFormModal({ defaultDate, onSubmit, onClose }) {
  const { subjects } = useAppData()
  const [v, setV] = useState({ title: '', type: 'prova', subjectId: '', date: defaultDate, time: '' })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })) }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!v.title.trim()) er.title = 'Dê um nome ao evento.'
    if (!v.date) er.date = 'Informe a data.'
    if (!v.time) er.time = 'Informe o horário.'
    setErrors(er)
    if (Object.keys(er).length) return
    onSubmit({ ...v, title: v.title.trim() })
  }

  const cls = (k) => `field__control${errors[k] ? ' has-error' : ''}`

  return (
    <Modal title="Novo evento" onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <div className="field">
          <span className="field__label" id="type-label">Tipo</span>
          <div className="chips" role="radiogroup" aria-labelledby="type-label">
            {TYPES.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={v.type === t.id} className={`chip${v.type === t.id ? ' is-active' : ''}`} onClick={() => setV((s) => ({ ...s, type: t.id }))}>{t.label}</button>
            ))}
          </div>
        </div>
        <Field id="ev-title" label="Nome" required error={errors.title}>
          <input id="ev-title" className={cls('title')} value={v.title} onChange={set('title')} placeholder="Ex.: Prova de Derivadas" autoFocus />
        </Field>
        <Field id="ev-subject" label="Disciplina">
          <select id="ev-subject" className="field__control" value={v.subjectId} onChange={set('subjectId')}>
            <option value="">Sem matéria</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <div className="field-row">
          <Field id="ev-date" label="Data" required error={errors.date}><input id="ev-date" type="date" className={cls('date')} value={v.date} onChange={set('date')} /></Field>
          <Field id="ev-time" label="Horário" required error={errors.time}><input id="ev-time" type="time" className={cls('time')} value={v.time} onChange={set('time')} /></Field>
        </div>
        <p className="form__note">Entregas aparecem sozinhas a partir das tarefas, e o estudo vem do modo Foco.</p>
        <button type="submit" className="btn btn--primary">Salvar evento</button>
      </form>
    </Modal>
  )
}
