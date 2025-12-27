import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch } from "+/redux"

import { setWords, type WordEntry } from "+/redux/slices/wordsSlice"

import { ensureUniqueIds, normalizeWord, parseWordsInput } from "../utils/wordsImport"

type Status = { kind: "idle" | "success" | "error"; text: string }

type JsonWordsEditorProps = {
  words: WordEntry[]
}

export function JsonWordsEditor({ words }: JsonWordsEditorProps) {
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
        const normalized = wordsRaw.map(normalizeWord).filter((w): w is WordEntry => Boolean(w))
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
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-lg backdrop-blur">
      <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
        JSON de palabras
      </div>
      <div className="px-4 py-3">
        <textarea
          value={editorValue}
          onChange={(e) => setEditorValue(e.target.value)}
          rows={18}
          className="max-h-[520px] w-full resize-y rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 font-mono text-xs text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
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
