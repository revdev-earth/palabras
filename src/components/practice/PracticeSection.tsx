import { useDispatch, useSelector } from "+/redux"
import { useSpeaker } from "+/hooks/useSpeaker"
import {
  exitPractice,
  markPractice,
  setAlwaysShow,
  toggleReveal,
} from "+/redux/slices/practiceSlice"

const badge = (label: string) => (
  <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm">
    {label}
  </span>
)

function PracticeSection() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const currentPracticeSelectionIds = useSelector(
    (s) => s.practice.currentPracticeSelectionIds
  )
  const practiceQueue = useSelector((s) => s.practice.practiceQueue)
  const practiceIndex = useSelector((s) => s.practice.practiceIndex)
  const correctCount = useSelector((s) => s.practice.correctCount)
  const wrongCount = useSelector((s) => s.practice.wrongCount)
  const alwaysShow = useSelector((s) => s.practice.alwaysShow)
  const reveal = useSelector((s) => s.practice.reveal)
  const summary = useSelector((s) => s.practice.summary)
  const practiceRounds = useSelector((s) => s.settings.practiceRounds)
  const { speak, isSpeaking, stopSpeaking } = useSpeaker()
  const speakerBtnClass =
    "rounded-full border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-sm"

  const practiceWord = practiceQueue.length
    ? words.find((w) => w.id === practiceQueue[practiceIndex]) || null
    : null
  const currentPracticeSelection = currentPracticeSelectionIds
    .map((id) => words.find((w) => w.id === id))
    .filter((w): w is (typeof words)[number] => Boolean(w))

  const practiceActive = practiceQueue.length > 0 && !!practiceWord
  const toggleSpeak = (text: string, opts?: { sentencePerLine?: boolean }) => {
    if (isSpeaking) stopSpeaking()
    else speak(text, opts)
  }

  if (!practiceActive || !practiceWord) return null

  const progressPct = practiceQueue.length
    ? Math.min(100, Math.round((practiceIndex / practiceQueue.length) * 100))
    : 0

  return (
    <section className="rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-lg">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
        {badge(`Palabras: ${currentPracticeSelection.length}`)}
        {badge(`Reps/Palabra: ${practiceRounds}`)}
        {badge(
          `Progreso: ${Math.min(practiceIndex, practiceQueue.length)} / ${
            practiceQueue.length
          }`
        )}
        {badge(`✔️ ${correctCount} · ❌ ${wrongCount}`)}
        <label className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          <input
            type="checkbox"
            checked={alwaysShow}
            onChange={(e) => dispatch(setAlwaysShow(e.target.checked))}
            className="h-4 w-4 rounded border-slate-300 text-slate-800"
          />
          Mostrar siempre traducción y notas
        </label>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-50">
        <div
          className="h-full rounded-full bg-linear-to-r from-slate-500 to-slate-800 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <details className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700">
        <summary className="cursor-pointer select-none font-semibold">
          Ver palabras seleccionadas
        </summary>
        <div className="mt-2 space-y-1 text-slate-700">
          {currentPracticeSelection.map((w) => (
            <div
              key={w.id}
              className="rounded-lg bg-white px-3 py-2 shadow-inner"
            >
              <strong>{w.term}</strong> → {w.translation}
            </div>
          ))}
        </div>
      </details>

      <div
        className="mt-4 cursor-pointer rounded-2xl border border-slate-100 bg-linear-to-b from-white to-slate-50 px-6 py-8 text-center shadow-lg"
        onClick={() => {
          if (!alwaysShow) dispatch(toggleReveal())
        }}
      >
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleSpeak(practiceWord.term)
            }}
            className={speakerBtnClass}
            title={isSpeaking ? "Detener audio" : "Pronunciar palabra"}
          >
            {isSpeaking ? "⏹️" : "🔊"}
          </button>
          <span>{practiceWord.term}</span>
        </div>
        {(reveal || alwaysShow) && (
          <>
            <div className="mt-3 text-xl font-semibold text-slate-800">
              {practiceWord.translation}
            </div>
            {practiceWord.notes && (
              <div className="mt-2 flex items-start justify-center gap-2 text-sm text-slate-700">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSpeak(practiceWord.notes || "", {
                      sentencePerLine: true,
                    })
                  }}
                  className={`${speakerBtnClass} mt-0.5`}
                  title={isSpeaking ? "Detener audio" : "Pronunciar notas"}
                >
                  {isSpeaking ? "⏹️" : "🔊"}
                </button>
                <div className="whitespace-pre-wrap text-left">
                  {practiceWord.notes}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            if (!alwaysShow) dispatch(toggleReveal())
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        >
          Mostrar / ocultar
        </button>
        <button
          onClick={() => dispatch(markPractice({ ok: true }))}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-lg"
        >
          ✔️ La recordé
        </button>
        <button
          onClick={() => dispatch(markPractice({ ok: false }))}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-lg"
        >
          ❌ No la recordé
        </button>
        <button
          onClick={() => dispatch(exitPractice())}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:border-rose-300"
        >
          Terminar sesión
        </button>
      </div>

      {summary && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-800">
          {summary}
        </div>
      )}
    </section>
  )
}

export default PracticeSection
