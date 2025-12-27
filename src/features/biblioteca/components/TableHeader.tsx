import type { SortBy } from "+/types"

import { columns } from "./tableLayout"
import { nextSort, sortIndicator } from "../utils/tableSort"

type TableHeaderProps = {
  sortBy: SortBy
  defaultSort: SortBy
  onSortChange: (next: SortBy) => void
}

export function TableHeader({ sortBy, defaultSort, onSortChange }: TableHeaderProps) {
  const renderHeaderButton = (label: string, asc: SortBy, desc: SortBy) => {
    const indicator = sortIndicator(sortBy, asc, desc)
    return (
      <button
        type="button"
        onClick={() => onSortChange(nextSort(sortBy, asc, desc, defaultSort))}
        className="flex items-center gap-1 text-left uppercase tracking-wide text-slate-600 transition hover:text-slate-900"
      >
        {label}
        {indicator && <span className="text-[10px] leading-none">{indicator}</span>}
      </button>
    )
  }

  return (
    <div className={`${columns.headerRow} ${columns.desktopGrid}`}>
      <span className="text-center">Sel.</span>
      {renderHeaderButton("Palabra", "term", "termDesc")}
      {renderHeaderButton("Traducción", "translation", "translationDesc")}
      {renderHeaderButton("Notas", "notes", "notesDesc")}
      <div className="text-center">{renderHeaderButton("Score", "scoreAsc", "score")}</div>
      {renderHeaderButton("Última práctica", "lastPracticedAtAsc", "lastPracticedAt")}
      {renderHeaderButton("Agregado", "createdAtAsc", "createdAt")}
      <span>Acciones</span>
    </div>
  )
}
