import type { SearchField } from "+/types"

type TableToolbarProps = {
  search: string
  searchField: SearchField
  selectAllChecked: boolean
  onSearchChange: (value: string) => void
  onSearchFieldChange: (field: SearchField) => void
  onSelectAll: (checked: boolean) => void
}

export function TableToolbar({
  search,
  searchField,
  selectAllChecked,
  onSearchChange,
  onSearchFieldChange,
  onSelectAll,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Listado de palabras</h2>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-inner">
            <span className="text-xs font-semibold uppercase text-slate-600">Buscar</span>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                searchField === "term" ? "Filtrar por palabra..." : "Filtrar por traducción..."
              }
              className="w-full flex-1 bg-transparent text-sm text-slate-900 outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-inner">
            <span className="uppercase text-slate-500">En</span>
            {(["term", "translation"] as SearchField[]).map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => onSearchFieldChange(field)}
                className={`rounded-lg px-2 py-1 transition ${
                  searchField === field
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {field === "term" ? "Palabra" : "Traducción"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-800"
        />
        Seleccionar todo (vista actual)
      </label>
    </div>
  )
}
