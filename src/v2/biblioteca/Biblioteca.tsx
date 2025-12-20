import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch } from "+/redux"

import { setWords } from "+/redux/slices/v2Slice"

import { genId, nowISO } from "+/utils"
import Table from "./Table"

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

const parseWordsInput = (value: string) => {
  try {
    return JSON.parse(value) as unknown
  } catch (jsonError) {
    try {
      const cleaned = value
        .trim()
        .replace(/^;+/, "")
        .replace(/^export\s+default\s+/, "")
        .replace(/^module\.exports\s*=\s*/, "")
      // Allow JS object/array literals (unquoted keys, trailing commas) for local editing.
      return Function(`"use strict"; return (${cleaned});`)() as unknown
    } catch (jsError) {
      const message = (jsonError as Error).message || (jsError as Error).message
      throw new Error(message)
    }
  }
}

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
        const parsed = parseWordsInput(editorValue)
        const wordsRaw = Array.isArray(parsed) ? parsed : (parsed as { words?: unknown }).words
        if (!Array.isArray(wordsRaw)) {
          throw new Error("El JSON debe ser un array o contener la llave 'words'.")
        }
        const normalized = wordsRaw.map(normalizeWord).filter((w): w is V2Word => Boolean(w))
        if (wordsRaw.length > 0 && normalized.length === 0) {
          throw new Error("No se encontraron palabras válidas en el JSON.")
        }
        dispatch(setWords(ensureUniqueIds(normalized)))
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
      {tab === "json" ? <JsonWordsEditor words={words} /> : <Table words={words} />}
    </div>
  )
}
