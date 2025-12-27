import { useDispatch, useSelector } from "+/redux"

import { toggleSelect } from "+/redux/slices/wordsSlice"

import { normalizeTerm } from "../utils/text"

type LearningWordsPanelProps = {
  learningWords: Array<{ term: string; score: number }>
}

export function LearningWordsPanel({ learningWords }: LearningWordsPanelProps) {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const selectedIds = useSelector((s) => s.words.selectedIds)
  const wordsByTerm = new Map(
    words.map((word) => [normalizeTerm(word.term), word] as const)
  )

  const handleTogglePractice = (term: string) => {
    const lookup = wordsByTerm.get(normalizeTerm(term))
    if (!lookup) return
    dispatch(
      toggleSelect({
        id: lookup.id,
        checked: !selectedIds.includes(lookup.id),
      })
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Palabras en aprendizaje
      </div>
      {learningWords.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {learningWords.map((word) => {
            const id = wordsByTerm.get(normalizeTerm(word.term))?.id || ""
            const isSelected = id ? selectedIds.includes(id) : false
            return (
              <button
                key={word.term}
                type="button"
                onClick={() => handleTogglePractice(word.term)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                  isSelected
                    ? "border-amber-300 bg-amber-200 text-amber-900"
                    : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {word.term} · {word.score}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-2 text-sm text-slate-500">
          No hay palabras en aprendizaje.
        </div>
      )}
    </div>
  )
}
