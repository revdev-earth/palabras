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
  const [sinceDate, setSinceDate] = useState("")
  const lastSnapshotRef = useRef(prettyJson)

  const exportWords = useMemo(() => {
    if (!sinceDate) return []
    const startAt = new Date(`${sinceDate}T00:00:00Z`).getTime()
    if (Number.isNaN(startAt)) return []
    return words.filter((word) => new Date(word.createdAt).getTime() >= startAt)
  }, [sinceDate, words])

  const exportJson = useMemo(() => JSON.stringify(exportWords, null, 2), [exportWords])

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
        <div className="mt-4 rounded-xl border border-slate-100 bg-white px-3 py-3 text-xs text-slate-700 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold uppercase text-slate-500">Exportar desde fecha</span>
              <input
                type="date"
                value={sinceDate}
                onChange={(e) => setSinceDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800"
              />
              <span className="text-[11px] text-slate-500">
                {sinceDate ? `${exportWords.length} palabra(s)` : "Elige una fecha"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(exportJson)
                  } catch {
                    window.prompt("Copia el JSON manualmente:", exportJson)
                  }
                }}
                disabled={!sinceDate || exportWords.length === 0}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-inner transition ${
                  sinceDate && exportWords.length
                    ? "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                Copiar JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!sinceDate || !exportWords.length) return
                  const blob = new Blob([exportJson], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `palabras-desde-${sinceDate}.json`
                  document.body.appendChild(link)
                  link.click()
                  link.remove()
                  URL.revokeObjectURL(url)
                }}
                disabled={!sinceDate || exportWords.length === 0}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-inner transition ${
                  sinceDate && exportWords.length
                    ? "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                Descargar JSON
              </button>
            </div>
          </div>
          {sinceDate && exportWords.length === 0 && (
            <div className="mt-2 text-[11px] text-slate-500">
              No hay palabras con createdAt desde esa fecha.
            </div>
          )}
        </div>
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
