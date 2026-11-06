import { ChevronDown, Globe, PlayCircle, ExternalLink, Trash2 } from 'lucide-react'
import { domainOf } from '../../services/formatters.js'

export default function LinkItem({ link, expanded, onToggle, onRemove }) {
  const isVideo = link.type === 'video'
  const Icon = isVideo ? PlayCircle : Globe

  return (
    <article className={`item${expanded ? ' is-open' : ''}`}>
      <button type="button" className="item__row" onClick={onToggle} aria-expanded={expanded}>
        <span className="item__icon item__icon--link"><Icon size={18} /></span>
        <span className="item__text">
          <span className="item__title">{link.title}</span>
          <span className="item__meta">{domainOf(link.url)}{isVideo ? ' · vídeo' : ''}</span>
        </span>
        <ChevronDown size={16} className="item__chevron" />
      </button>

      {expanded && (
        <div className="item__panel">
          <p className="preview__label">Visualização do link</p>
          <div className="link-preview">
            <p className="link-preview__title">{link.title}</p>
            {link.description && <p className="link-preview__text">{link.description}</p>}
            {link.tags?.length > 0 && <div className="link-preview__tags">{link.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
            <a className="btn btn--primary" href={link.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Abrir no navegador</a>
          </div>
          <button type="button" className="task-action task-action--danger" onClick={onRemove}><Trash2 size={13} /> Remover link</button>
        </div>
      )}
    </article>
  )
}
