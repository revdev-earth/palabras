import { RefObject } from "react"
import { SortBy } from "../types"

interface Props {
  sortBy: SortBy
  onSortChange: (v: SortBy) => void
  search: string
  onSearchChange: (v: string) => void
  onExport: () => void
  onImportTrigger: () => void
  onImportFile: (file: File) => void
  importRef: RefObject<HTMLInputElement>
  onWipe: () => void
  onPracticeRandom: () => void
  onPracticeFirst: () => void
  onPracticeSelected: () => void
}

function ControlsPanel({
  sortBy,
  onSortChange,
  search,
  onSearchChange,
  onExport,
  onImportTrigger,
  onImportFile,
  importRef,
  onWipe,
  onPracticeRandom,
  onPracticeFirst,
  onPracticeSelected,
}: Props) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white/90 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          Ordenar por:
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
          >
            <option value="score">Score (efectivo)</option>
            <option value="scoreAsc">Score (menor→mayor)</option>
            <option value="lastPracticedAt">Última práctica (más reciente)</option>
            <option value="lastPracticedAtAsc">Última práctica (más antigua)</option>
            <option value="createdAt">Fecha agregado</option>
            <option value="term">Palabra (A→Z)</option>
          </select>
        </label>
        <label className="flex flex-1 items-center gap-2 text-sm text-ink-700">
          Búsqueda:
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrar por palabra o traducción..."
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onExport}
          className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm hover:border-ink-300"
        >
          Exportar (.json)
        </button>
        <button
          onClick={onImportTrigger}
          className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm hover:border-ink-300"
        >
          Importar
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImportFile(file)
          }}
        />
        <button
          onClick={onWipe}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:border-rose-300"
        >
          Borrar todo
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          onClick={onPracticeRandom}
          className="rounded-xl border border-ink-100 bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Practicar 10 (aleatorio)
        </button>
        <button
          onClick={onPracticeFirst}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
        >
          Practicar 10 (primeras de la lista)
        </button>
        <button
          onClick={onPracticeSelected}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
        >
          Practicar selección
        </button>
      </div>
    </section>
  )
}

export default ControlsPanel
