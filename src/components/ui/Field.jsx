export default function Field({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}{required && <em> *</em>}</label>
      {children}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
