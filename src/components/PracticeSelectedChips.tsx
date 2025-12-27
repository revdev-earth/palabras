import { useMemo } from "react"

import { useDispatch, useSelector } from "+/redux"
import { toggleSelect } from "+/redux/slices/wordsSlice"

type Props = {
  className?: string
  emptyLabel?: string
}

export function PracticeSelectedChips({
  className = "",
  emptyLabel = 'Selecciona palabras en "Aprendiendo".',
}: Props) {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const selectedIds = useSelector((s) => s.words.selectedIds)

  const chips = useMemo(() => {
    const byId = new Map(words.map((word) => [word.id, word.term]))
    return selectedIds
      .map((id) => {
        const term = byId.get(id)
        return term ? { id, term } : null
      })
      .filter((item): item is { id: string; term: string } => Boolean(item))
  }, [selectedIds, words])

  return (
    <div className={`flex flex-wrap gap-2 text-[11px] ${className}`.trim()}>
      {chips.length ? (
        chips.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch(toggleSelect({ id: item.id, checked: false }))}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 transition hover:bg-emerald-100"
            title="Quitar de practica"
          >
            {item.term}
          </button>
        ))
      ) : (
        <span className="text-slate-500">{emptyLabel}</span>
      )}
    </div>
  )
}
