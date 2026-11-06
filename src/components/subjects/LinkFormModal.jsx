import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Field from '../ui/Field.jsx'
import { normalizeUrl, isValidUrl, domainOf, isVideoUrl } from '../../services/formatters.js'

export default function LinkFormModal({ onSubmit, onClose }) {
  const [v, setV] = useState({ url: '', title: '', description: '' })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const url = normalizeUrl(v.url)
    if (!isValidUrl(url)) { setError('Informe um endereço válido, como khanacademy.org.'); return }
    onSubmit({
      id: `l${Date.now()}`,
      url,
      title: v.title.trim() || domainOf(url),
      description: v.description.trim(),
      type: isVideoUrl(url) ? 'video' : 'site',
      tags: [],
    })
  }

  return (
    <Modal title="Adicionar link" onClose={onClose}>
      <form className="form" onSubmit={submit} noValidate>
        <Field id="link-url" label="Endereço" required error={error}>
          <input id="link-url" className={`field__control${error ? ' has-error' : ''}`} value={v.url} onChange={(e) => { setV({ ...v, url: e.target.value }); setError('') }} placeholder="https://" autoFocus />
        </Field>
        <Field id="link-title" label="Título">
          <input id="link-title" className="field__control" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="Como você quer chamar este link?" />
        </Field>
        <Field id="link-desc" label="Descrição">
          <textarea id="link-desc" className="field__control" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} placeholder="Para que ele serve?" />
        </Field>
        <button type="submit" className="btn btn--primary">Adicionar link</button>
      </form>
    </Modal>
  )
}
