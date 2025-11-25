import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { applyScore, deleteWord, setSelectedIds, toggleSelect, updateWord } from "../store"
import { effectiveScore, filterAndSortWords, formatDate } from "../utils"
import { Word } from "../types"

function WordsTable() {
  const dispatch = useDispatch()
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const words = useSelector((s) => s.app.words)
  const search = useSelector((s) => s.app.search)
  const sortBy = useSelector((s) => s.app.settings.sortBy)
  const currentPracticeSelection = useSelector((s) => s.app.currentPracticeSelection)
  const filteredWords = useMemo(
    () => filterAndSortWords(words, search, sortBy),
    [words, search, sortBy]
  )

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ term: "", translation: "", notes: "" })

  const selectAllChecked =
    filteredWords.length > 0 && filteredWords.every((w) => selectedSet.has(w.id))

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
    dispatch(applyScore({ id, delta }))
  }

  const onDelete = (id: string) => {
    if (!window.confirm("¿Borrar palabra?")) return
    dispatch(deleteWord(id))
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
    dispatch(
      updateWord({
        id,
        term: editDraft.term.trim(),
        translation: editDraft.translation.trim(),
        notes: editDraft.notes,
      })
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

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-ink-900">Listado de palabras</h2>
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

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-ink-800">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-600">
            <tr>
              <th className="px-4 py-3">Sel.</th>
              <th className="px-4 py-3">Palabra</th>
              <th className="px-4 py-3">Traducción</th>
              <th className="px-4 py-3">Notas</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3">Última práctica</th>
              <th className="px-4 py-3">Agregado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((w) => {
              const isEditing = editingId === w.id
              const expanded = expandedNotes.has(w.id)
              return (
                <tr key={w.id} className="border-b border-ink-50 hover:bg-ink-50/50">
                  <td className="px-4 py-3 align-top">
                    <input
                      type="checkbox"
                      disabled={isEditing}
                      checked={selectedSet.has(w.id)}
                      onChange={(e) =>
                        dispatch(toggleSelect({ id: w.id, checked: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-ink-300 text-ink-800"
                    />
                  </td>
                  <td className="px-4 py-3 align-top font-semibold text-ink-900">
                    {isEditing ? (
                      <input
                        value={editDraft.term}
                        onChange={(e) => setEditDraft((d) => ({ ...d, term: e.target.value }))}
                        className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{w.term}</span>
                        {currentPracticeSelection.some((x) => x.id === w.id) && (
                          <span className="rounded-md border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                            en práctica
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-ink-800">
                    {isEditing ? (
                      <input
                        value={editDraft.translation}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, translation: e.target.value }))
                        }
                        className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                      />
                    ) : (
                      w.translation
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-ink-700">
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
                            expanded ? "whitespace-pre-wrap" : "note-clamp whitespace-pre-wrap"
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
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-800">
                      {effectiveScore(w).toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-ink-600">
                    {formatDate(w.lastPracticedAt)}
                  </td>
                  <td className="px-4 py-3 align-top text-ink-600">{formatDate(w.createdAt)}</td>
                  <td className="px-4 py-3 align-top text-ink-800">
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onSaveEdit(w.id)}
                          className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-800"
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
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:border-ink-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(w.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:border-rose-300"
                        >
                          Borrar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {!filteredWords.length && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-500">
                  No hay palabras. Añade algunas para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default WordsTable
