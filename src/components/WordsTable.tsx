import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import {
  applyScore,
  deleteWord,
  setSearch,
  setSearchField,
  setSelectedIds,
  setSettings,
  toggleSelect,
  updateWord,
} from "../store"
import { defaultSettings, effectiveScore, filterAndSortWords, formatDate } from "../utils"
import { SearchField, SortBy, Word } from "../types"

const columns = {
  desktopGrid:
    "md:grid-cols-[30px,0.6fr,0.8fr,minmax(180px,1.3fr),60px,100px,100px,120px] md:gap-3",
  headerRow:
    "hidden px-4 py-2 text-xs uppercase tracking-wide text-ink-600 md:grid md:items-center",
  bodyRow: "grid gap-3 px-4 py-3 md:items-start",
}

const nextSort = (current: SortBy, asc: SortBy, desc: SortBy, fallback: SortBy) => {
  if (current === asc) return desc
  if (current === desc) return fallback
  return asc
}

const sortIndicator = (current: SortBy, asc: SortBy, desc: SortBy) => {
  if (current === asc) return "↑"
  if (current === desc) return "↓"
  return ""
}

const preserveScroll = (fn: () => void) => {
  const y = window.scrollY
  fn()
  requestAnimationFrame(() => window.scrollTo({ top: y }))
}

function WordsTable() {
  const dispatch = useDispatch()
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const words = useSelector((s) => s.app.words)
  const search = useSelector((s) => s.app.search)
  const searchField = useSelector((s) => s.app.searchField)
  const sortBy = useSelector((s) => s.app.settings.sortBy)
  const currentPracticeSelection = useSelector((s) => s.app.currentPracticeSelection)
  const filteredWords = useMemo(
    () => filterAndSortWords(words, search, sortBy, searchField),
    [words, search, sortBy, searchField]
  )

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ term: "", translation: "", notes: "" })

  const selectAllChecked =
    filteredWords.length > 0 && filteredWords.every((w) => selectedSet.has(w.id))

  const defaultSort = defaultSettings.sortBy

  const toggleExpandNotes = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const onScore = (id: string, delta: number) => {
    if (editingId && editingId !== id) {
      window.alert("Primero guarda o cancela la edición actual.")
      return
    }
    preserveScroll(() => dispatch(applyScore({ id, delta })))
  }

  const onDelete = (id: string) => {
    if (!window.confirm("¿Borrar palabra?")) return
    preserveScroll(() => dispatch(deleteWord(id)))
  }

  const startEdit = (word: Word) => {
    if (editingId && editingId !== word.id) {
      const ok = window.confirm("Tienes otra fila en edición. ¿Descartar cambios y editar esta?")
      if (!ok) return
    }
    setEditingId(word.id)
    setEditDraft({ term: word.term, translation: word.translation, notes: word.notes })
  }

  const cancelEdit = () => setEditingId(null)

  const onSaveEdit = (id: string) => {
    if (!editDraft.term.trim() || !editDraft.translation.trim()) {
      window.alert("Palabra y traducción son obligatorias.")
      return
    }
    preserveScroll(() =>
      dispatch(
        updateWord({
          id,
          term: editDraft.term.trim(),
          translation: editDraft.translation.trim(),
          notes: editDraft.notes,
        })
      )
    )
    setEditingId(null)
  }

  const selectAll = (checked: boolean) => {
    if (!checked) {
      const next = selectedIds.filter((id) => !filteredWords.find((w) => w.id === id))
      dispatch(setSelectedIds(next))
      return
    }
    const next = new Set(selectedIds)
    filteredWords.forEach((w) => next.add(w.id))
    dispatch(setSelectedIds(Array.from(next)))
  }

  const renderHeaderButton = (label: string, asc: SortBy, desc: SortBy) => {
    const indicator = sortIndicator(sortBy, asc, desc)
    return (
      <button
        type="button"
        onClick={() =>
          preserveScroll(() =>
            dispatch(setSettings({ sortBy: nextSort(sortBy, asc, desc, defaultSort) }))
          )
        }
        className="flex items-center gap-1 text-left uppercase tracking-wide text-ink-600 transition hover:text-ink-900"
      >
        {label}
        {indicator && <span className="text-[10px] leading-none">{indicator}</span>}
      </button>
    )
  }

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-ink-900">Listado de palabras</h2>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2 shadow-inner">
              <span className="text-xs font-semibold uppercase text-ink-600">Buscar</span>
              <input
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder={searchField === "term" ? "Filtrar por palabra..." : "Filtrar por traducción..."}
                className="w-full flex-1 bg-transparent text-sm text-ink-900 outline-none"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-ink-100 bg-ink-50 px-2 py-1 text-[11px] font-semibold text-ink-700 shadow-inner">
              <span className="uppercase text-ink-500">En</span>
              {(["term", "translation"] as SearchField[]).map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => dispatch(setSearchField(field))}
                  className={`rounded-lg px-2 py-1 transition ${
                    searchField === field
                      ? "bg-ink-900 text-white shadow-soft"
                      : "text-ink-700 hover:bg-white"
                  }`}
                >
                  {field === "term" ? "Palabra" : "Traducción"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={selectAllChecked}
            onChange={(e) => selectAll(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-ink-800"
          />
          Seleccionar todo (vista actual)
        </label>
      </div>

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

      <div className="divide-y divide-ink-50">
        {filteredWords.map((w) => {
          const isEditing = editingId === w.id
          const expanded = expandedNotes.has(w.id)
          return (
            <div key={w.id} className={`${columns.bodyRow} ${columns.desktopGrid}`}>
              <div className="flex items-start gap-2 md:justify-center">
                <input
                  type="checkbox"
                  disabled={isEditing}
                  checked={selectedSet.has(w.id)}
                  onChange={(e) => dispatch(toggleSelect({ id: w.id, checked: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-ink-300 text-ink-800"
                />
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Palabra</p>
                {isEditing ? (
                  <input
                    value={editDraft.term}
                    onChange={(e) => setEditDraft((d) => ({ ...d, term: e.target.value }))}
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="break-words font-semibold text-ink-900">{w.term}</span>
                    {currentPracticeSelection.some((x) => x.id === w.id) && (
                      <span className="rounded-md border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                        en práctica
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Traducción</p>
                {isEditing ? (
                  <input
                    value={editDraft.translation}
                    onChange={(e) => setEditDraft((d) => ({ ...d, translation: e.target.value }))}
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                ) : (
                  <span className="break-words text-ink-800">{w.translation}</span>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Notas</p>
                {isEditing ? (
                  <textarea
                    value={editDraft.notes}
                    onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                ) : w.notes ? (
                  <button
                    type="button"
                    onClick={() => toggleExpandNotes(w.id)}
                    className="group w-full text-left text-ink-700"
                  >
                    <div
                      className={
                        expanded
                          ? "whitespace-pre-wrap break-words"
                          : "note-clamp whitespace-pre-wrap break-words"
                      }
                    >
                      {w.notes}
                    </div>
                    <span className="text-[11px] text-ink-500 group-hover:text-ink-700">
                      {expanded ? "Ocultar" : "Ver más"}
                    </span>
                  </button>
                ) : (
                  <span className="text-ink-400">—</span>
                )}
              </div>

              <div className="space-y-1 text-center">
                <p className="text-[11px] text-ink-500 md:hidden">Score</p>
                <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-800">
                  {effectiveScore(w).toFixed(1)}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Última práctica</p>
                <p className="text-ink-600">{formatDate(w.lastPracticedAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Agregado</p>
                <p className="text-ink-600">{formatDate(w.createdAt)}</p>
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-[11px] text-ink-500 md:hidden">Acciones</p>
                {isEditing ? (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => onSaveEdit(w.id)}
                      className="rounded-lg bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg border border-ink-200 px-2.5 py-1 text-[11px] font-semibold text-ink-800"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {[-1, 1, 2].map((d) => (
                      <button
                        key={d}
                        onClick={() => onScore(w.id, d)}
                        className="rounded-lg border border-ink-200 px-2 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                      >
                        {d > 0 ? `+${d}` : d}
                      </button>
                    ))}
                    <button
                      onClick={() => startEdit(w)}
                      className="rounded-lg border border-ink-200 px-2.5 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(w.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:border-rose-300"
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {!filteredWords.length && (
          <div className="px-4 py-10 text-center text-sm text-ink-500">
            No hay palabras. Añade algunas para comenzar.
          </div>
        )}
      </div>
    </section>
  )
}

export default WordsTable
