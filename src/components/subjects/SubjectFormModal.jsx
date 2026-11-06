import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Field from '../ui/Field.jsx'
import { WEEKDAY_CHIPS } from '../../services/dateUtils.js'

const COLORS = ['lilac', 'green', 'blue', 'peach', 'yellow']
const EMPTY = { name: '', professor: '', days: [], start: '', end: '', room: '', color: 'lilac' }

export default function SubjectFormModal({ onSubmit, onClose }) {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })) }
  const toggleDay = (d) => setV((s) => ({ ...s, days: s.days.includes(d) ? s.days.filter((x) => x !== d) : [...s.days, d] }))

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!v.name.trim()) er.name = 'Dê um nome para a matéria.'
    if (v.start && v.end && v.end <= v.start) er.end = 'O fim deve ser depois do início.'
    setErrors(er)
    if (Object.keys(er).length) return
    onSubmit({ ...v, name: v.name.trim(), professor: v.professor.trim(), room: v.room.trim(), symbol: v.name.trim().charAt(0).toUpperCase() })
  }

  return (
    <Modal title="Nova matéria" onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <Field id="sub-name" label="Nome" required error={errors.name}>
          <input id="sub-name" className={`field__control${errors.name ? ' has-error' : ''}`} value={v.name} onChange={set('name')} placeholder="Ex.: Física" autoFocus />
        </Field>
        <Field id="sub-prof" label="Professor(a)">
          <input id="sub-prof" className="field__control" value={v.professor} onChange={set('professor')} placeholder="Ex.: Profa. Maria Souza" />
        </Field>

        <div className="field">
          <span className="field__label" id="days-label">Dias de aula</span>
          <div className="chips" role="group" aria-labelledby="days-label">
            {WEEKDAY_CHIPS.map((d) => (
              <button key={d.value} type="button" className={`chip${v.days.includes(d.value) ? ' is-active' : ''}`} aria-pressed={v.days.includes(d.value)} onClick={() => toggleDay(d.value)}>{d.label}</button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <Field id="sub-start" label="Início"><input id="sub-start" type="time" className="field__control" value={v.start} onChange={set('start')} /></Field>
          <Field id="sub-end" label="Fim" error={errors.end}><input id="sub-end" type="time" className={`field__control${errors.end ? ' has-error' : ''}`} value={v.end} onChange={set('end')} /></Field>
        </div>

        <Field id="sub-room" label="Sala">
          <input id="sub-room" className="field__control" value={v.room} onChange={set('room')} placeholder="Ex.: Sala B204" />
        </Field>

        <div className="field">
          <span className="field__label" id="color-label">Cor</span>
          <div className="chips" role="radiogroup" aria-labelledby="color-label">
            {COLORS.map((c) => (
              <button key={c} type="button" role="radio" aria-checked={v.color === c} aria-label={c} className={`swatch tone--${c}${v.color === c ? ' is-active' : ''}`} onClick={() => setV((s) => ({ ...s, color: c }))} />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn--primary">Criar matéria</button>
      </form>
    </Modal>
  )
}
