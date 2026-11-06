const R = 88
const CIRC = 2 * Math.PI * R

export default function TimerRing({ progress, mode, children }) {
  return (
    <div className={`ring ring--${mode}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className="ring__track" cx="100" cy="100" r={R} />
        <circle className="ring__bar" cx="100" cy="100" r={R} strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - Math.min(1, Math.max(0, progress)))} />
      </svg>
      <div className="ring__center">{children}</div>
    </div>
  )
}
