import { PRACTICE_REPS } from "../constants"
import { Word } from "../types"

interface Props {
  practiceActive: boolean
  practiceWord: Word | null
  currentPracticeSelection: Word[]
  practiceQueue: string[]
  practiceIndex: number
  correctCount: number
  wrongCount: number
  alwaysShow: boolean
  onAlwaysShowChange: (v: boolean) => void
  reveal: boolean
  onToggleReveal: () => void
  onMark: (ok: boolean) => void
  onExit: () => void
  summary: string | null
}

const badge = (label: string) => (
  <span className="rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs text-ink-700 shadow-sm">
    {label}
  </span>
)

function PracticeSection({
  practiceActive,
  practiceWord,
  currentPracticeSelection,
  practiceQueue,
  practiceIndex,
  correctCount,
  wrongCount,
  alwaysShow,
  onAlwaysShowChange,
  reveal,
  onToggleReveal,
  onMark,
  onExit,
  summary,
}: Props) {
  if (!practiceActive || !practiceWord) return null

  const progressPct = practiceQueue.length
    ? Math.min(100, Math.round((practiceIndex / practiceQueue.length) * 100))
    : 0

  return (
    <section className="rounded-2xl border border-ink-100 bg-white/95 p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-700">
        {badge(`Palabras: ${currentPracticeSelection.length}`)}
        {badge(`Reps/Palabra: ${PRACTICE_REPS}`)}
        {badge(`Progreso: ${Math.min(practiceIndex, practiceQueue.length)} / ${practiceQueue.length}`)}
        {badge(`✔️ ${correctCount} · ❌ ${wrongCount}`)}
        <label className="flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
          <input
            type="checkbox"
            checked={alwaysShow}
            onChange={(e) => onAlwaysShowChange(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-ink-800"
          />
          Mostrar siempre traducción y notas
        </label>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ink-500 to-ink-800 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <details className="mt-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3 text-sm text-ink-700">
        <summary className="cursor-pointer select-none font-semibold">Ver palabras seleccionadas</summary>
        <div className="mt-2 space-y-1 text-ink-700">
          {currentPracticeSelection.map((w) => (
            <div key={w.id} className="rounded-lg bg-white px-3 py-2 shadow-inner">
              <strong>{w.term}</strong> → {w.translation}
            </div>
          ))}
        </div>
      </details>

      <div
        className="mt-4 cursor-pointer rounded-2xl border border-ink-100 bg-gradient-to-b from-white to-ink-50 px-6 py-8 text-center shadow-soft"
        onClick={() => {
          if (!alwaysShow) onToggleReveal()
        }}
      >
        <div className="text-2xl font-bold text-ink-900">{practiceWord.term}</div>
        {(reveal || alwaysShow) && (
          <>
            <div className="mt-3 text-xl font-semibold text-ink-800">{practiceWord.translation}</div>
            {practiceWord.notes && (
              <div className="mt-2 whitespace-pre-wrap text-sm text-ink-700">{practiceWord.notes}</div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            if (!alwaysShow) onToggleReveal()
          }}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-800 hover:border-ink-300"
        >
          Mostrar / ocultar
        </button>
        <button
          onClick={() => onMark(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg"
        >
          ✔️ La recordé
        </button>
        <button
          onClick={() => onMark(false)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg"
        >
          ❌ No la recordé
        </button>
        <button
          onClick={onExit}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:border-rose-300"
        >
          Terminar sesión
        </button>
      </div>

      {summary && (
        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/80 px-4 py-3 text-sm text-ink-800">
          {summary}
        </div>
      )}
    </section>
  )
}

export default PracticeSection
