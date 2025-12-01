import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { setSelectedIds, setWordsAndSettings } from "../store"
import { Settings, Word } from "../types"
import { defaultSettings, genId, nowISO } from "../utils"

type Status =
  | { kind: "idle"; text: string }
  | { kind: "success" | "error"; text: string }

type ConflictDecision = "keep" | "replace" | "addNew"
type ConflictItem = { existing: Word; incoming: Word; decision: ConflictDecision }

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
  const [pendingConflicts, setPendingConflicts] = useState<ConflictItem[]>([])
  const [pendingNonConflicts, setPendingNonConflicts] = useState<Word[]>([])

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
      const existingByTerm = new Map(safeExisting.map((w) => [normalizeTerm(w.term), w]))
      const conflicts: ConflictItem[] = []
      const nonConflicts: Word[] = []

      for (const incoming of incomingWords) {
        const key = normalizeTerm(incoming.term)
        const existing = existingByTerm.get(key)
        if (existing) conflicts.push({ existing, incoming, decision: "replace" })
        else nonConflicts.push(incoming)
      }

      if (conflicts.length) {
        setPendingConflicts(conflicts)
        setPendingNonConflicts(nonConflicts)
        setStatus({
          kind: "idle",
          text: `Se encontraron ${conflicts.length} conflicto(s). Elige cómo resolver cada uno y pulsa "Aplicar decisiones".`,
        })
        return
      }

      const merged = appendWithoutConflicts(nonConflicts, safeExisting)
      dispatch(setWordsAndSettings({ words: merged, settings }))
      dispatch(setSelectedIds([]))
      setAppendValue("")
      setStatus({ kind: "success", text: `Se adjuntaron ${nonConflicts.length} palabra(s).` })
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message })
    }
  }

  const applyConflictDecisions = () => {
    try {
      const safeExisting = ensureUniqueIds(words)
      const merged = resolveConflicts({
        conflicts: pendingConflicts,
        nonConflicts: pendingNonConflicts,
        existing: safeExisting,
      })
      dispatch(setWordsAndSettings({ words: merged, settings }))
      dispatch(setSelectedIds([]))
      setAppendValue("")
      setPendingConflicts([])
      setPendingNonConflicts([])
      setStatus({ kind: "success", text: "Conflictos resueltos y datos adjuntados." })
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
          {pendingConflicts.length > 0 && (
            <div className="mt-3 space-y-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-xs text-ink-900">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">
                  Conflictos encontrados ({pendingConflicts.length})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPendingConflicts([])
                      setPendingNonConflicts([])
                    }}
                    className="rounded border border-ink-100 bg-white px-2 py-1 font-medium hover:border-ink-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={applyConflictDecisions}
                    className="rounded bg-ink-900 px-3 py-1 font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Aplicar decisiones
                  </button>
                </div>
              </div>
              <p className="text-ink-700">
                Elige para cada palabra si prefieres mantener la existente, reemplazarla o agregarla como nueva.
              </p>
              <div className="space-y-2">
                {pendingConflicts.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-ink-100 bg-white/70 p-2 shadow-inner">
                    <div className="text-[11px] font-semibold text-ink-900">
                      {item.incoming.term} — nueva traducción: {item.incoming.translation}
                    </div>
                    <div className="grid gap-1 text-[11px] text-ink-800 sm:grid-cols-2">
                      <div>
                        <div className="font-semibold text-ink-700">Actual</div>
                        <div>Term: {item.existing.term}</div>
                        <div>Trad: {item.existing.translation}</div>
                        {item.existing.notes && <div>Notas: {item.existing.notes}</div>}
                      </div>
                      <div>
                        <div className="font-semibold text-ink-700">Nueva</div>
                        <div>Term: {item.incoming.term}</div>
                        <div>Trad: {item.incoming.translation}</div>
                        {item.incoming.notes && <div>Notas: {item.incoming.notes}</div>}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium">
                      {(["replace", "keep", "addNew"] as ConflictDecision[]).map((choice) => (
                        <label key={choice} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`conflict-${idx}`}
                            value={choice}
                            checked={item.decision === choice}
                            onChange={() =>
                              setPendingConflicts((prev) =>
                                prev.map((c, i) => (i === idx ? { ...c, decision: choice } : c))
                              )
                            }
                          />
                          {choice === "replace" && "Reemplazar actual"}
                          {choice === "keep" && "Mantener actual (ignorar nueva)"}
                          {choice === "addNew" && "Agregar como nueva palabra"}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

const normalizeTerm = (term: string) => term.trim().toLowerCase()

const appendWithoutConflicts = (incoming: Word[], existing: Word[]) => {
  const used = new Set(existing.map((w) => w.id))
  const toAdd = incoming.map((w) => {
    let id = w.id
    while (used.has(id)) id = genId()
    used.add(id)
    return { ...w, id }
  })
  return [...toAdd, ...existing]
}

const resolveConflicts = ({
  conflicts,
  nonConflicts,
  existing,
}: {
  conflicts: ConflictItem[]
  nonConflicts: Word[]
  existing: Word[]
}) => {
  const usedIds = new Set(existing.map((w) => w.id))
  const base = [...existing]
  const newWords: Word[] = []

  const replaceExisting = (targetId: string, nextWord: Word) => {
    for (let i = 0; i < base.length; i++) {
      if (base[i].id === targetId) {
        base[i] = nextWord
        return
      }
    }
    newWords.push(nextWord)
  }

  const addNewWord = (incoming: Word) => {
    let id = incoming.id
    while (usedIds.has(id)) id = genId()
    usedIds.add(id)
    newWords.push({ ...incoming, id })
  }

  for (const conflict of conflicts) {
    const existingWord = base.find((w) => w.id === conflict.existing.id) || conflict.existing
    if (conflict.decision === "keep") continue
    if (conflict.decision === "replace") {
      const next = { ...conflict.incoming, id: existingWord.id }
      replaceExisting(existingWord.id, next)
      continue
    }
    if (conflict.decision === "addNew") addNewWord(conflict.incoming)
  }

  for (const inc of nonConflicts) addNewWord(inc)

  return [...newWords, ...base]
}

export default StorageTools
