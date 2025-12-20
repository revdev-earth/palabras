import {
  addV2Word,
  LEARNING_STATES,
  LearningState,
  removeV2Word,
  updateV2WordScore,
  upsertV2Word,
  V2Word,
} from "+/redux/slices/v2Slice"
import { effectiveScore, formatDate, genId, nowISO } from "+/utils"
import { useState } from "react"
import { useDispatch } from "react-redux"

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const renderList = (items: string[]) => {
  if (!items.length) return <span className="text-ink-400">—</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-700"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

const learningBadgeTone = (state: LearningState) => {
  switch (state) {
    case "LEARNED":
      return "border-emerald-100 bg-emerald-50 text-emerald-700"
    case "LEARNING_3":
      return "border-indigo-100 bg-indigo-50 text-indigo-700"
    case "LEARNING_2":
      return "border-orange-100 bg-orange-50 text-orange-700"
    case "LEARNING_1":
      return "border-yellow-100 bg-yellow-50 text-yellow-700"
    default:
      return "border-teal-100 bg-teal-50 text-teal-700"
  }
}

export default function WordsTableView({ words }: { words: V2Word[] }) {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    term: "",
    translation: "",
    notes: "",
    context: "",
    contextForPractice: "",
    learningState: "SAVED" as LearningState,
  })
  const [editDraft, setEditDraft] = useState({
    term: "",
    translation: "",
    notes: "",
    context: "",
    contextForPractice: "",
    learningState: "SAVED" as LearningState,
  })

  const resetDraft = () =>
    setDraft({
      term: "",
      translation: "",
      notes: "",
      context: "",
      contextForPractice: "",
      learningState: "SAVED",
    })

  const startAdd = () => setIsAdding(true)

  const startEdit = (word: V2Word) => {
    if (isAdding) return
    setEditingId(word.id)
    setEditDraft({
      term: word.term,
      translation: word.translation,
      notes: word.notes,
      context: word.context.join(", "),
      contextForPractice: word.contextForPractice.join(", "),
      learningState: word.learningState,
    })
  }

  const cancelEdit = () => setEditingId(null)

  const cancelAdd = () => {
    resetDraft()
    setIsAdding(false)
  }

  const saveAdd = () => {
    if (!draft.term.trim() || !draft.translation.trim()) {
      window.alert("Palabra y traducción son obligatorias.")
      return
    }
    dispatch(
      addV2Word({
        id: genId(),
        term: draft.term.trim(),
        translation: draft.translation.trim(),
        notes: draft.notes,
        context: parseList(draft.context),
        contextForPractice: parseList(draft.contextForPractice),
        learningState: draft.learningState,
      })
    )
    resetDraft()
    setIsAdding(false)
  }

  const saveEdit = (word: V2Word) => {
    if (!editDraft.term.trim() || !editDraft.translation.trim()) {
      window.alert("Palabra y traducción son obligatorias.")
      return
    }
    dispatch(
      upsertV2Word({
        term: editDraft.term.trim(),
        translation: editDraft.translation.trim(),
        notes: editDraft.notes,
        context: parseList(editDraft.context),
        contextForPractice: parseList(editDraft.contextForPractice),
        learningState: editDraft.learningState,
        previousTerm: word.term,
      })
    )
    setEditingId(null)
  }

  const updateScore = (word: V2Word, delta: number) => {
    const nextScore = Math.max(0, (word.baseScore || 0) + delta)
    dispatch(
      updateV2WordScore({
        id: word.id,
        baseScore: nextScore,
        lastPracticedAt: nowISO(),
      })
    )
  }

  const deleteWord = (word: V2Word) => {
    if (!window.confirm(`¿Borrar "${word.term}"?`)) return
    dispatch(removeV2Word(word.id))
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-soft backdrop-blur">
      <div className="border-b border-ink-100 px-4 py-3 text-sm font-semibold text-ink-800">
        Tabla
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-600">
            <tr>
              <th className="px-4 py-3">Palabra</th>
              <th className="px-4 py-3">Traducción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Notas</th>
              <th className="px-4 py-3">Contexto</th>
              <th className="px-4 py-3">Contexto práctica</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3">Última práctica</th>
              <th className="px-4 py-3">Agregado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {!isAdding && (
              <tr>
                <td colSpan={10} className="px-4 py-3">
                  <button
                    type="button"
                    onClick={startAdd}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-ink-50 text-sm font-semibold text-ink-800 shadow-inner transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
                    aria-label="Agregar palabra"
                    title="Agregar palabra"
                  >
                    +
                  </button>
                </td>
              </tr>
            )}
            {isAdding && (
              <tr className="align-top">
                <td className="px-4 py-3">
                  <input
                    value={draft.term}
                    onChange={(e) => setDraft((d) => ({ ...d, term: e.target.value }))}
                    placeholder="Palabra"
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={draft.translation}
                    onChange={(e) => setDraft((d) => ({ ...d, translation: e.target.value }))}
                    placeholder="Traducción"
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={draft.learningState}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        learningState: e.target.value as LearningState,
                      }))
                    }
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  >
                    {LEARNING_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    value={draft.notes}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                    placeholder="Notas"
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={draft.context}
                    onChange={(e) => setDraft((d) => ({ ...d, context: e.target.value }))}
                    placeholder="ej: saludo, color, ropa"
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={draft.contextForPractice}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, contextForPractice: e.target.value }))
                    }
                    placeholder="ej: buch-wir-spielen"
                    className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-center text-ink-500">—</td>
                <td className="px-4 py-3 text-ink-500">—</td>
                <td className="px-4 py-3 text-ink-500">—</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={saveAdd}
                      className="rounded-lg bg-ink-900 px-3 py-1 text-xs font-semibold text-white shadow-soft"
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      onClick={cancelAdd}
                      className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-800"
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {words.map((w) => (
              <tr key={w.id} className="align-top">
                <td className="px-4 py-3 font-semibold text-ink-900">
                  {editingId === w.id ? (
                    <input
                      value={editDraft.term}
                      onChange={(e) => setEditDraft((d) => ({ ...d, term: e.target.value }))}
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    />
                  ) : (
                    w.term
                  )}
                </td>
                <td className="px-4 py-3 text-ink-800">
                  {editingId === w.id ? (
                    <input
                      value={editDraft.translation}
                      onChange={(e) => setEditDraft((d) => ({ ...d, translation: e.target.value }))}
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    />
                  ) : (
                    w.translation
                  )}
                </td>
                <td className="px-4 py-3 text-ink-800">
                  {editingId === w.id ? (
                    <select
                      value={editDraft.learningState}
                      onChange={(e) =>
                        setEditDraft((d) => ({
                          ...d,
                          learningState: e.target.value as LearningState,
                        }))
                      }
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    >
                      {LEARNING_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${learningBadgeTone(
                        w.learningState
                      )}`}
                    >
                      {w.learningState}
                    </span>
                  )}
                </td>
                <td className="whitespace-pre-wrap px-4 py-3 text-ink-700">
                  {editingId === w.id ? (
                    <input
                      value={editDraft.notes}
                      onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))}
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    />
                  ) : (
                    w.notes || "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === w.id ? (
                    <input
                      value={editDraft.context}
                      onChange={(e) => setEditDraft((d) => ({ ...d, context: e.target.value }))}
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    />
                  ) : (
                    renderList(w.context)
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === w.id ? (
                    <input
                      value={editDraft.contextForPractice}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, contextForPractice: e.target.value }))
                      }
                      className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                    />
                  ) : (
                    renderList(w.contextForPractice)
                  )}
                </td>
                <td className="px-4 py-3 text-center text-ink-700">
                  {effectiveScore(w).toFixed(1)}
                </td>
                <td className="px-4 py-3 text-ink-600">{formatDate(w.lastPracticedAt)}</td>
                <td className="px-4 py-3 text-ink-600">{formatDate(w.createdAt)}</td>
                <td className="px-4 py-3">
                  {editingId === w.id ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(w)}
                        className="rounded-lg bg-ink-900 px-3 py-1 text-xs font-semibold text-white shadow-soft"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {[-1, 1, 2].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => updateScore(w, d)}
                          className="rounded-lg border border-ink-200 px-2 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                        >
                          {d > 0 ? `+${d}` : d}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => startEdit(w)}
                        className="rounded-lg border border-ink-200 px-2.5 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteWord(w)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:border-rose-300"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!words.length && !isAdding && (
          <div className="px-4 py-10 text-center text-sm text-ink-500">
            No hay palabras todavía.
          </div>
        )}
      </div>
    </section>
  )
}
