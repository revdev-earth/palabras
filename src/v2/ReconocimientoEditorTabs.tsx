import { useEffect, useMemo, useRef, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

import type { LearningState } from "+/redux/slices/v2Slice"
import { LEARNING_STATES } from "+/redux/slices/v2Slice"

export type WordDraft = {
  term: string
  translation: string
  notes: string
  context: string
  contextForPractice: string
  learningState: LearningState
}

type Props = {
  draft: WordDraft
  setDraft: Dispatch<SetStateAction<WordDraft>>
  onSave: () => void
  onClose: () => void
  contextSuggestions: string[]
  onAddContextSuggestion: (value: string) => void
}

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function ReconocimientoEditorTabs({
  draft,
  setDraft,
  onSave,
  onClose,
  contextSuggestions,
  onAddContextSuggestion,
}: Props) {
  const [tab, setTab] = useState<"form" | "json">("form")
  const [error, setError] = useState("")
  const jsonSnapshot = useMemo(
    () =>
      JSON.stringify(
        {
          term: draft.term,
          translation: draft.translation,
          notes: draft.notes,
          context: normalizeList(draft.context),
          contextForPractice: normalizeList(draft.contextForPractice),
          learningState: draft.learningState,
        },
        null,
        2
      ),
    [draft]
  )
  const [editorValue, setEditorValue] = useState(jsonSnapshot)
  const lastSnapshotRef = useRef(jsonSnapshot)

  useEffect(() => {
    const prevSnapshot = lastSnapshotRef.current
    if (editorValue === prevSnapshot) setEditorValue(jsonSnapshot)
    lastSnapshotRef.current = jsonSnapshot
  }, [editorValue, jsonSnapshot])

  const handleJsonChange = (value: string) => {
    setEditorValue(value)
    try {
      const parsed = JSON.parse(value)
      if (!parsed || typeof parsed !== "object") {
        throw new Error("El JSON debe ser un objeto con los campos de la palabra.")
      }
      setDraft((prev) => {
        const next = { ...prev }
        if (typeof (parsed as { term?: unknown }).term === "string") {
          next.term = (parsed as { term: string }).term
        }
        if (typeof (parsed as { translation?: unknown }).translation === "string") {
          next.translation = (parsed as { translation: string }).translation
        }
        if (typeof (parsed as { notes?: unknown }).notes === "string") {
          next.notes = (parsed as { notes: string }).notes
        }
        if ("context" in (parsed as { context?: unknown })) {
          next.context = normalizeList((parsed as { context?: unknown }).context).join(", ")
        }
        if ("contextForPractice" in (parsed as { contextForPractice?: unknown })) {
          next.contextForPractice = normalizeList(
            (parsed as { contextForPractice?: unknown }).contextForPractice
          ).join(", ")
        }
        if (
          typeof (parsed as { learningState?: unknown }).learningState === "string" &&
          LEARNING_STATES.includes((parsed as { learningState: LearningState }).learningState)
        ) {
          next.learningState = (parsed as { learningState: LearningState }).learningState
        }
        return next
      })
      setError("")
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white/80 p-1 text-[11px] font-semibold text-ink-700 shadow-inner">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`rounded-full px-3 py-1 transition ${
              tab === "form" ? "bg-orange-500 text-white shadow-soft" : "hover:bg-white"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setTab("json")}
            className={`rounded-full px-3 py-1 transition ${
              tab === "json" ? "bg-orange-500 text-white shadow-soft" : "hover:bg-white"
            }`}
          >
            JSON
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-ink-200 px-2 py-1 text-[11px] font-semibold text-ink-700"
        >
          Cerrar
        </button>
      </div>

      {tab === "form" ? (
        <div className="space-y-2 text-ink-700">
          <input
            value={draft.term}
            onChange={(e) => setDraft((prev) => ({ ...prev, term: e.target.value }))}
            placeholder="Palabra"
            className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
          />
          <input
            value={draft.translation}
            onChange={(e) => setDraft((prev) => ({ ...prev, translation: e.target.value }))}
            placeholder="Traduccion"
            className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
          />
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              Estado
            </div>
            <select
              value={draft.learningState}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  learningState: e.target.value as LearningState,
                }))
              }
              className="w-full rounded-md border border-ink-100 bg-white px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
            >
              {LEARNING_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
            rows={2}
            placeholder="Notas"
            className="w-full resize-none rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
          />
          <input
            value={draft.context}
            onChange={(e) => setDraft((prev) => ({ ...prev, context: e.target.value }))}
            placeholder="Contexto (coma separada)"
            className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
          />
          <input
            value={draft.contextForPractice}
            onChange={(e) => setDraft((prev) => ({ ...prev, contextForPractice: e.target.value }))}
            placeholder="Contexto practica"
            className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
          />
          {contextSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px]">
              {contextSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onAddContextSuggestion(tag)}
                  className="rounded-full border border-orange-200 px-2 py-0.5 font-semibold text-orange-700"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={editorValue}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-md border border-ink-100 bg-ink-50/60 px-2 py-1 font-mono text-[11px] text-ink-900 shadow-inner focus:border-orange-300 focus:outline-none"
          />
          {contextSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {contextSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onAddContextSuggestion(tag)}
                  className="rounded-full border border-orange-200 px-2 py-0.5 font-semibold text-orange-700"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
          {error && (
            <div className="mt-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
              {error}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-orange-500 px-2 py-1 text-[11px] font-semibold text-white"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
