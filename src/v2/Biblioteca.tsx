import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch } from "+/redux"

import type { LearningState } from "+/redux/slices/v2Slice"
import {
  LEARNING_STATES,
  addV2Word,
  learningStateFromScore,
  normalizeLearningState,
  setV2Words,
} from "+/redux/slices/v2Slice"

import { effectiveScore, formatDate, genId, nowISO } from "+/utils"

type Status = { kind: "idle" | "success" | "error"; text: string }

type V2Word = {
  id: string
  term: string
  translation: string
  notes: string
  baseScore: number
  lastPracticedAt: string | null
  createdAt: string
  context: string[]
  contextForPractice: string[]
  learningState: LearningState
}

const normalizeList = (raw: unknown) => {
  if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean)
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const normalizeWord = (raw: unknown): V2Word | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Partial<V2Word>
  const term = typeof obj.term === "string" ? obj.term.trim() : ""
  const translation = typeof obj.translation === "string" ? obj.translation.trim() : ""
  if (!term || !translation) return null
  const notes = typeof obj.notes === "string" ? obj.notes : ""
  const baseScore =
    typeof obj.baseScore === "number" && Number.isFinite(obj.baseScore)
      ? Math.max(0, obj.baseScore)
      : 2
  const lastPracticedAt =
    typeof obj.lastPracticedAt === "string" && obj.lastPracticedAt.trim()
      ? obj.lastPracticedAt
      : null
  const createdAt =
    typeof obj.createdAt === "string" && obj.createdAt.trim() ? obj.createdAt : nowISO()
  let id = typeof obj.id === "string" && obj.id.trim() ? obj.id : genId()
  const context = normalizeList(obj.context)
  const contextForPractice = normalizeList(obj.contextForPractice)
  const learningState = normalizeLearningState(obj.learningState, baseScore)
  return {
    id,
    term,
    translation,
    notes,
    baseScore,
    lastPracticedAt,
    createdAt,
    context,
    contextForPractice,
    learningState,
  }
}

const ensureUniqueIds = (list: V2Word[]) => {
  const seen = new Set<string>()
  return list.map((w) => {
    let id = w.id
    while (seen.has(id)) id = genId()
    seen.add(id)
    return { ...w, id }
  })
}

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
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "LEARNING_3":
      return "border-indigo-200 bg-indigo-50 text-indigo-700"
    case "LEARNING_2":
      return "border-orange-200 bg-orange-50 text-orange-700"
    case "LEARNING_1":
      return "border-amber-200 bg-amber-50 text-amber-700"
    default:
      return "border-teal-200 bg-teal-50 text-teal-700"
  }
}

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

function JsonWordsEditor({ words }: { words: V2Word[] }) {
  const dispatch = useDispatch()
  const prettyJson = useMemo(() => JSON.stringify(words, null, 2), [words])
  const [editorValue, setEditorValue] = useState(prettyJson)
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" })
  const lastSnapshotRef = useRef(prettyJson)

  useEffect(() => {
    const prevSnapshot = lastSnapshotRef.current
    if (editorValue === prevSnapshot) setEditorValue(prettyJson)
    lastSnapshotRef.current = prettyJson
  }, [editorValue, prettyJson])

  useEffect(() => {
    if (editorValue === prettyJson) {
      if (status.kind !== "idle") setStatus({ kind: "idle", text: "" })
      return
    }
    const id = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(editorValue)
        const wordsRaw = Array.isArray(parsed) ? parsed : (parsed as { words?: unknown }).words
        if (!Array.isArray(wordsRaw)) {
          throw new Error("El JSON debe ser un array o contener la llave 'words'.")
        }
        const normalized = wordsRaw.map(normalizeWord).filter((w): w is V2Word => Boolean(w))
        if (wordsRaw.length > 0 && normalized.length === 0) {
          throw new Error("No se encontraron palabras válidas en el JSON.")
        }
        dispatch(setV2Words(ensureUniqueIds(normalized)))
        setStatus({ kind: "success", text: "Actualizado automáticamente." })
      } catch (err) {
        setStatus({ kind: "error", text: (err as Error).message })
      }
    }, 700)
    return () => window.clearTimeout(id)
  }, [dispatch, editorValue, prettyJson, status.kind])

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-soft backdrop-blur">
      <div className="border-b border-ink-100 px-4 py-3 text-sm font-semibold text-ink-800">
        JSON de palabras
      </div>
      <div className="px-4 py-3">
        <textarea
          value={editorValue}
          onChange={(e) => setEditorValue(e.target.value)}
          rows={18}
          className="max-h-[520px] w-full resize-y rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2 font-mono text-xs text-ink-900 shadow-inner focus:border-ink-400 focus:outline-none"
        />
        {status.text && (
          <div
            className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
              status.kind === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {status.text}
          </div>
        )}
      </div>
    </section>
  )
}

function WordsTableView({ words }: { words: V2Word[] }) {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState({
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
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {!isAdding && (
              <tr>
                <td colSpan={9} className="px-4 py-3">
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
                <td className="px-4 py-3 font-semibold text-ink-900">{w.term}</td>
                <td className="px-4 py-3 text-ink-800">{w.translation}</td>
                <td className="px-4 py-3 text-ink-800">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${learningBadgeTone(
                      w.learningState
                    )}`}
                  >
                    {w.learningState}
                  </span>
                </td>
                <td className="whitespace-pre-wrap px-4 py-3 text-ink-700">{w.notes || "—"}</td>
                <td className="px-4 py-3">{renderList(w.context)}</td>
                <td className="px-4 py-3">{renderList(w.contextForPractice)}</td>
                <td className="px-4 py-3 text-center text-ink-700">
                  {effectiveScore(w).toFixed(1)}
                </td>
                <td className="px-4 py-3 text-ink-600">{formatDate(w.lastPracticedAt)}</td>
                <td className="px-4 py-3 text-ink-600">{formatDate(w.createdAt)}</td>
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

export function Biblioteca({ words }: { words: V2Word[] }) {
  const [tab, setTab] = useState<"json" | "table">("table")

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-1 rounded-full border border-ink-100 bg-white/80 p-1 text-xs font-semibold text-ink-700 shadow-inner">
        <button
          type="button"
          onClick={() => setTab("json")}
          className={`rounded-full px-4 py-1.5 transition ${
            tab === "json" ? "bg-ink-900 text-white shadow-soft" : "hover:bg-white"
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setTab("table")}
          className={`rounded-full px-4 py-1.5 transition ${
            tab === "table" ? "bg-ink-900 text-white shadow-soft" : "hover:bg-white"
          }`}
        >
          Tabla
        </button>
      </div>
      {tab === "json" ? <JsonWordsEditor words={words} /> : <WordsTableView words={words} />}
    </div>
  )
}
