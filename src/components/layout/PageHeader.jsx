import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/** Topo das telas: logo "margem" ou botão Voltar + eyebrow + título serifado. */
export default function PageHeader({ eyebrow, title, back, action }) {
  return (
    <>
      <div className="page-top">
        {back ? (
          <Link to={back} className="page-top__back"><ChevronLeft size={14} /> Voltar</Link>
        ) : (
          <span className="brand">Agenda acadêmica</span> //TROCAR NOME QUE FICA NO TOPO DA PAGINA
        )}
        {action}
      </div>
      <header className="page-header">
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
      </header>
    </>
  )
}
