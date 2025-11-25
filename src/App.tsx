import { useEffect, useMemo, useRef, useState } from "react"
import AddWordForm from "./components/AddWordForm"
import ControlsPanel from "./components/ControlsPanel"
import PracticeSection from "./components/PracticeSection"
import StatsHeader from "./components/StatsHeader"
import WordsTable from "./components/WordsTable"
import { SortBy, Word } from "./types"
import { useAppDispatch, useAppSelector } from "./hooks"
import {
  addWord,
  applyScore,
  deleteWord,
  exitPractice as exitPracticeAction,
  markPractice as markPracticeAction,
  setAlwaysShow as setAlwaysShowAction,
  setSettings as setSettingsAction,
  setWordsAndSettings,
  startPractice as startPracticeAction,
  toggleReveal as toggleRevealAction,
  updateWord,
  wipeAll as wipeAllAction,
} from "./store"
import { STORE_KEY, SETTINGS_KEY, defaultSettings, effectiveScore, genId, sampleWords, todayKey } from "./utils"

function App() {
  const dispatch = useAppDispatch()
  const words = useAppSelector((s) => s.app.words)
  const settings = useAppSelector((s) => s.app.settings)
  const currentPracticeSelection = useAppSelector((s) => s.app.currentPracticeSelection)
  const practiceQueue = useAppSelector((s) => s.app.practiceQueue)
  const practiceIndex = useAppSelector((s) => s.app.practiceIndex)
  const correctCount = useAppSelector((s) => s.app.correctCount)
  const wrongCount = useAppSelector((s) => s.app.wrongCount)
  const summary = useAppSelector((s) => s.app.summary)
  const alwaysShow = useAppSelector((s) => s.app.alwaysShow)
  const reveal = useAppSelector((s) => s.app.reveal)

  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  const [term, setTerm] = useState("")
  const [translation, setTranslation] = useState("")
  const [notes, setNotes] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ term: "", translation: "", notes: "" })

  const importRef = useRef<HTMLInputElement | null>(null)
  const translationRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(words))
  }, [words])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const tickNewDay = () => {
      const today = todayKey()
      if (settings.lastSeenDay !== today) dispatch(setSettingsAction({ lastSeenDay: today }))
    }
    tickNewDay()
    const id = setInterval(tickNewDay, 60 * 1000)
    return () => clearInterval(id)
  }, [dispatch, settings.lastSeenDay])

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase()
    const sortBy = settings.sortBy || defaultSettings.sortBy
    const data = words.filter(
      (w) =>
        !q ||
        w.term.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        (w.notes || "").toLowerCase().includes(q)
    )

    data.sort((a, b) => {
      if (sortBy === "score") return effectiveScore(b) - effectiveScore(a)
      if (sortBy === "scoreAsc") return effectiveScore(a) - effectiveScore(b)
      if (sortBy === "lastPracticedAt")
        return new Date(b.lastPracticedAt || 0).getTime() - new Date(a.lastPracticedAt || 0).getTime()
      if (sortBy === "lastPracticedAtAsc")
        return new Date(a.lastPracticedAt || 0).getTime() - new Date(b.lastPracticedAt || 0).getTime()
      if (sortBy === "createdAt") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "term") return a.term.localeCompare(b.term)
      return 0
    })
    return data
  }, [search, settings.sortBy, words])

  const dueCount = useMemo(
    () => words.filter((w) => effectiveScore(w) >= 2).length,
    [settings.lastSeenDay, words]
  )

  const practiceWord = useMemo(() => {
    const id = practiceQueue[practiceIndex]
    return words.find((w) => w.id === id) || null
  }, [practiceIndex, practiceQueue, words])

  const selectAllChecked =
    filteredWords.length > 0 && filteredWords.every((w) => selectedIds.has(w.id))

  const practiceActive = practiceQueue.length > 0

  const handleAddWord = () => {
    const t = term.trim()
    const tr = translation.trim()
    if (!t || !tr) return
    dispatch(addWord({ id: genId(), term: t, translation: tr, notes }))
    setTerm("")
    setTranslation("")
    setNotes("")
    translationRef.current?.focus()
  }

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleExpandNotes = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleScore = (id: string, delta: number) => {
    if (editingId && editingId !== id) {
      window.alert("Primero guarda o cancela la edición actual.")
      return
    }
    dispatch(applyScore({ id, delta }))
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("¿Borrar palabra?")) return
    dispatch(deleteWord(id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    if (editingId === id) setEditingId(null)
  }

  const startEdit = (word: Word) => {
    if (editingId && editingId !== word.id) {
      const ok = window.confirm(
        "Tienes otra fila en edición. ¿Descartar cambios y editar esta?"
      )
      if (!ok) return
    }
    setEditingId(word.id)
    setEditDraft({ term: word.term, translation: word.translation, notes: word.notes })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = (id: string) => {
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

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, words }, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vocab-tracker-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    try {
      const text = await file.text()
      const obj = JSON.parse(text)
      if (!obj || !Array.isArray(obj.words)) throw new Error("Formato inválido")
      dispatch(
        setWordsAndSettings({
          words: obj.words,
          settings: { ...defaultSettings, ...(obj.settings || {}) },
        })
      )
      setSelectedIds(new Set())
      setExpandedNotes(new Set())
      window.alert("Importación completa")
    } catch (err) {
      window.alert("No se pudo importar: " + (err as Error).message)
    } finally {
      if (importRef.current) importRef.current.value = ""
    }
  }

  const wipeAll = () => {
    if (
      !window.confirm(
        "Esto borrará todas las palabras guardadas en este navegador. ¿Seguro?"
      )
    )
      return
    dispatch(wipeAll())
    setSelectedIds(new Set())
    setExpandedNotes(new Set())
  }

  const startPracticeWithIds = (ids: string[]) => {
    if (!ids.length) {
      window.alert("No hay palabras para practicar.")
      return
    }
    if (editingId) {
      const ok = window.confirm(
        "Tienes una fila en edición. ¿Descartar cambios para iniciar la práctica?"
      )
      if (!ok) return
      setEditingId(null)
    }
    dispatch(startPracticeAction(ids))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const startRandom10 = () => {
    if (!words.length) {
      window.alert("No hay palabras aún. Añade algunas primero.")
      return
    }
    startPracticeWithIds(sampleWords(words, Math.min(10, words.length)).map((w) => w.id))
  }

  const startFirst10 = () => {
    startPracticeWithIds(filteredWords.slice(0, 10).map((w) => w.id))
  }

  const startSelected = () => startPracticeWithIds(Array.from(selectedIds))

  const markPractice = (ok: boolean) => {
    dispatch(markPracticeAction({ ok }))
  }

  const exitPractice = () => {
    if (!practiceActive) return
    dispatch(exitPracticeAction())
  }

  const selectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filteredWords.forEach((w) => next.delete(w.id))
        return next
      })
      return
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredWords.forEach((w) => next.add(w.id))
      return next
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <StatsHeader wordsCount={words.length} dueCount={dueCount} />

      {!practiceActive && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr,1.4fr]">
          <AddWordForm
            term={term}
            translation={translation}
            notes={notes}
            onTermChange={setTerm}
            onTranslationChange={setTranslation}
            onNotesChange={setNotes}
            onSubmit={handleAddWord}
            translationRef={translationRef}
          />
          <ControlsPanel
            sortBy={settings.sortBy as SortBy}
            onSortChange={(v) => dispatch(setSettingsAction({ sortBy: v }))}
            search={search}
            onSearchChange={setSearch}
            onExport={exportData}
            onImportTrigger={() => importRef.current?.click()}
            onImportFile={(file) => void importData(file)}
            importRef={importRef}
            onWipe={wipeAll}
            onPracticeRandom={startRandom10}
            onPracticeFirst={startFirst10}
            onPracticeSelected={startSelected}
          />
        </div>
      )}

      {!practiceActive && (
        <WordsTable
          filteredWords={filteredWords}
          selectedIds={selectedIds}
          selectAllChecked={selectAllChecked}
          onSelectAll={selectAll}
          onToggleSelect={toggleSelect}
          expandedNotes={expandedNotes}
          onToggleExpand={toggleExpandNotes}
          editingId={editingId}
          editDraft={editDraft}
          setEditDraft={setEditDraft}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onSaveEdit={saveEdit}
          onScore={handleScore}
          onDelete={handleDelete}
          currentPracticeSelection={currentPracticeSelection}
        />
      )}

      <PracticeSection
        practiceActive={practiceActive}
        practiceWord={practiceWord}
        currentPracticeSelection={currentPracticeSelection}
        practiceQueue={practiceQueue}
        practiceIndex={practiceIndex}
        correctCount={correctCount}
        wrongCount={wrongCount}
        alwaysShow={alwaysShow}
        onAlwaysShowChange={(v) => dispatch(setAlwaysShowAction(v))}
        reveal={reveal}
        onToggleReveal={() => dispatch(toggleRevealAction())}
        onMark={markPractice}
        onExit={exitPractice}
        summary={summary}
      />

      {!practiceActive && summary && (
        <section className="mt-4 rounded-xl border border-ink-100 bg-ink-50/80 px-4 py-3 text-sm text-ink-800">
          {summary}
        </section>
      )}
    </div>
  )
}

export default App
