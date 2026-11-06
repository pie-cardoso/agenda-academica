import { ChevronDown, FileText, Image as ImageIcon, File as FileIcon, Trash2 } from 'lucide-react'
import { formatBytes } from '../../services/formatters.js'
import { formatDayMonth } from '../../services/dateUtils.js'

const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'webp']

export default function FileItem({ file, expanded, onToggle, onRemove }) {
  const Icon = file.type === 'pdf' ? FileText : IMAGE_TYPES.includes(file.type) ? ImageIcon : FileIcon
  const meta = [file.pages && `${file.pages} páginas`, formatBytes(file.size), `adicionado em ${formatDayMonth(file.addedAt)}`].filter(Boolean).join(' · ')

  return (
    <article className={`item${expanded ? ' is-open' : ''}`}>
      <button type="button" className="item__row" onClick={onToggle} aria-expanded={expanded}>
        <span className="item__icon item__icon--file"><Icon size={16} /><small>{file.type.toUpperCase()}</small></span>
        <span className="item__text">
          <span className="item__title">{file.name}</span>
          <span className="item__meta">{meta}</span>
        </span>
        <ChevronDown size={16} className="item__chevron" />
      </button>

      {expanded && (
        <div className="item__panel">
          <p className="preview__label">Prévia simulada</p>
          <div className="preview">
            <p className="preview__kicker">{file.type.toUpperCase()} · material de estudo</p>
            <p className="preview__title">{file.name.replace(/\.[^.]+$/, '')}</p>
            <span className="preview__line" /><span className="preview__line" /><span className="preview__line preview__line--short" />
            <span className="preview__block" />
            <span className="preview__line" /><span className="preview__line preview__line--short" />
          </div>
          <button type="button" className="task-action task-action--danger" onClick={onRemove}><Trash2 size={13} /> Remover arquivo</button>
        </div>
      )}
    </article>
  )
}
