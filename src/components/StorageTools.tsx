import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { setSelectedIds, setWordsAndSettings } from "../store"
import { Settings, Word } from "../types"
import { defaultSettings, genId, nowISO } from "../utils"

type Status =
  | { kind: "idle"; text: string }
  | { kind: "success" | "error"; text: string }

const normalizeWord = (raw: unknown): Word | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Partial<Word>
  const term = typeof obj.term === "string" ? obj.term.trim() : ""
  const translation = typeof obj.translation === "string" ? obj.translation.trim() : ""
  if (!term || !translation) return null
  const notes = typeof obj.notes === "string" ? obj.notes : ""
  const baseScore =
    typeof obj.baseScore === "number" && Number.isFinite(obj.baseScore) ? Math.max(0, obj.baseScore) : 2
  const lastPracticedAt =
    typeof obj.lastPracticedAt === "string" && obj.lastPracticedAt.trim() ? obj.lastPracticedAt : null
  const createdAt =
    typeof obj.createdAt === "string" && obj.createdAt.trim() ? obj.createdAt : nowISO()
  let id = typeof obj.id === "string" && obj.id.trim() ? obj.id : genId()
  return { id, term, translation, notes, baseScore, lastPracticedAt, createdAt }
}

const parseWordsAndSettings = (text: string, currentSettings: Settings) => {
  const parsed = JSON.parse(text)
  const wordsRaw = Array.isArray(parsed) ? parsed : parsed.words
  if (!Array.isArray(wordsRaw)) {
    throw new Error("El JSON debe ser un array o contener la llave 'words'.")
  }
  const words = wordsRaw.map(normalizeWord).filter((w): w is Word => Boolean(w))
  if (!words.length) {
    throw new Error("No se encontraron palabras válidas en el JSON.")
  }
  const fileSettings =
    !Array.isArray(parsed) && parsed.settings && typeof parsed.settings === "object"
      ? (parsed.settings as Partial<Settings>)
      : {}
  return { words, settings: { ...defaultSettings, ...currentSettings, ...fileSettings } }
}

function StorageTools() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.app.words)
  const settings = useSelector((s) => s.app.settings)
  const [editorValue, setEditorValue] = useState("")
  const [appendValue, setAppendValue] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" })
  const [editorDirty, setEditorDirty] = useState(false)

  const snapshot = useMemo(() => JSON.stringify({ settings, words }, null, 2), [settings, words])

  useEffect(() => {
    if (!editorDirty) setEditorValue(snapshot)
  }, [editorDirty, snapshot])

  const handleSaveFromEditor = () => {
    try {
      const { words: parsedWords, settings: parsedSettings } = parseWordsAndSettings(editorValue, settings)
      const safeWords = ensureUniqueIds(parsedWords)
      dispatch(setWordsAndSettings({ words: safeWords, settings: parsedSettings }))
      dispatch(setSelectedIds([]))
      setStatus({ kind: "success", text: "Datos actualizados y guardados en localStorage." })
      setEditorDirty(false)
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message })
    }
  }

  const handleAppend = () => {
    try {
      const { words: incomingWords } = parseWordsAndSettings(appendValue, settings)
      const safeExisting = ensureUniqueIds(words)
      const usedIds = new Set(safeExisting.map((w) => w.id))
      const toAdd = incomingWords.map((w) => {
        let id = w.id
        while (usedIds.has(id)) id = genId()
        usedIds.add(id)
        return { ...w, id }
      })
      const merged = [...toAdd, ...safeExisting]
      dispatch(setWordsAndSettings({ words: merged, settings }))
      dispatch(setSelectedIds([]))
      setAppendValue("")
      setStatus({ kind: "success", text: `Se adjuntaron ${toAdd.length} palabra(s).` })
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message })
    }
  }

  const resetEditor = () => {
    setEditorDirty(false)
    setEditorValue(snapshot)
    setStatus({ kind: "idle", text: "" })
  }

  return (
    <div className="mt-3 space-y-3">
      <p className="text-xs text-ink-600">
        Aquí puedes ver lo que hay en localStorage y pegar un JSON para editarlo o adjuntar nuevas palabras sin perder las existentes.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink-800">Editor del JSON actual</span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={resetEditor}
                className="rounded-lg border border-ink-100 bg-white px-2 py-1 font-medium text-ink-700 hover:border-ink-300"
              >
                Recargar
              </button>
              <button
                onClick={handleSaveFromEditor}
                className="rounded-lg bg-ink-900 px-3 py-1 font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-md"
              >
                Guardar edición
              </button>
            </div>
          </div>
          <textarea
            value={editorValue}
            onChange={(e) => {
              setEditorDirty(true)
              setEditorValue(e.target.value)
            }}
            rows={12}
            className="w-full rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2 font-mono text-xs text-ink-900 shadow-inner focus:border-ink-400 focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink-800">Adjuntar JSON (sumar palabras)</span>
            <button
              onClick={handleAppend}
              className="rounded-lg border border-ink-800 bg-ink-900 px-3 py-1 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-md"
            >
              Adjuntar
            </button>
          </div>
          <textarea
            value={appendValue}
            onChange={(e) => setAppendValue(e.target.value)}
            placeholder='Ej: [{"id":"x","term":"hola","translation":"hello"}] o {"words":[...]}'
            rows={12}
            className="w-full rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2 font-mono text-xs text-ink-900 shadow-inner focus:border-ink-400 focus:outline-none"
          />
        </div>
      </div>

      {status.text && (
        <div
          className={`rounded-lg border px-3 py-2 text-xs ${
            status.kind === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {status.text}
        </div>
      )}
    </div>
  )
}

const ensureUniqueIds = (list: Word[]) => {
  const seen = new Set<string>()
  return list.map((w) => {
    let id = w.id
    while (seen.has(id)) id = genId()
    seen.add(id)
    return { ...w, id }
  })
}

export default StorageTools
