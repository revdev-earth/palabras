import { useSelector } from "+/hooks"
import { effectiveScore } from "+/utils"

const badge = (label: string) => (
  <span className="rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs text-ink-700 shadow-sm">
    {label}
  </span>
)

function StatsHeader() {
  const words = useSelector((s) => s.app.words)
  const dueCount = words.filter((w) => effectiveScore(w) >= 2).length

  return (
    <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-500">Vocab Tracker</p>
        <h1 className="text-3xl font-semibold text-ink-900">Tu cuaderno de palabras</h1>
        <p className="text-ink-600">Guarda, repasa y sigue tu progreso sin perder el ritmo.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {badge(`Palabras: ${words.length}`)}
        {badge(`Para hoy: ${dueCount}`)}
      </div>
    </header>
  )
}

export default StatsHeader
