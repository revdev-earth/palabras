import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { useSpeaker } from "+/hooks/useSpeaker"

import type { WordEntry } from "+/redux/slices/wordsSlice"
import {
  applyScore,
  removeWord,
  setSearch,
  setSearchField,
  setSelectedIds,
  toggleSelect,
  updateWord,
} from "+/redux/slices/wordsSlice"
import { setSettings } from "+/redux/slices/settingsSlice"

import { defaultSettings, effectiveScore, filterAndSortWords } from "+/utils"

import type { SortBy } from "+/types"

import { TableToolbar } from "./components/TableToolbar"
import { ContextFilters } from "./components/ContextFilters"
import { TableHeader } from "./components/TableHeader"
import { WordRow } from "./components/WordRow"

const preserveScroll = (fn: () => void) => {
  const y = window.scrollY
  fn()
  requestAnimationFrame(() => window.scrollTo({ top: y }))
}

const ITEMS_PER_PAGE = 50

function WordsTablePaginated({ words }: { words: WordEntry[] }) {
  const dispatch = useDispatch()
  const selectedIds = useSelector((s) => s.words.selectedIds)
  const search = useSelector((s) => s.words.search)
  const searchField = useSelector((s) => s.words.searchField)
  const sortBy = useSelector((s) => s.settings.sortBy)
  const { speak, isSpeaking, stopSpeaking } = useSpeaker({ enabled: true })
  const [activeContexts, setActiveContexts] = useState<Set<string>>(new Set())
  const [activePracticeContexts, setActivePracticeContexts] = useState<
    Set<string>
  >(new Set())
  const [currentPage, setCurrentPage] = useState(0)

  // Pre-calcular scores una sola vez
  const scoresMap = useMemo(() => {
    const map = new Map<string, number>()
    words.forEach((w) => map.set(w.id, effectiveScore(w)))
    return map
  }, [words])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const filteredWords = useMemo(
    () => filterAndSortWords(words, search, sortBy, searchField),
    [words, search, sortBy, searchField]
  )

  // Optimizar generación de opciones de contexto
  const contextOptions = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) => (w.context || []).forEach((c) => set.add(c)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"))
  }, [words])

  const contextPracticeOptions = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) =>
      (w.contextForPractice || []).forEach((c) => set.add(c))
    )
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"))
  }, [words])

  const matchingWords = useMemo(() => {
    if (!activeContexts.size && !activePracticeContexts.size) return words
    return words.filter((word) => {
      if (activeContexts.size) {
        const contexts = word.context || []
        const hasAll = Array.from(activeContexts).every((c) =>
          contexts.includes(c)
        )
        if (!hasAll) return false
      }
      if (activePracticeContexts.size) {
        const practices = word.contextForPractice || []
        const hasAll = Array.from(activePracticeContexts).every((c) =>
          practices.includes(c)
        )
        if (!hasAll) return false
      }
      return true
    })
  }, [activeContexts, activePracticeContexts, words])

  const availableContextTags = useMemo(() => {
    const set = new Set<string>()
    matchingWords.forEach((w) => (w.context || []).forEach((c) => set.add(c)))
    return set
  }, [matchingWords])

  const availablePracticeTags = useMemo(() => {
    const set = new Set<string>()
    matchingWords.forEach((w) =>
      (w.contextForPractice || []).forEach((c) => set.add(c))
    )
    return set
  }, [matchingWords])

  // Filtrar palabras visibles
  const visibleWords = useMemo(() => {
    if (!activeContexts.size && !activePracticeContexts.size)
      return filteredWords

    return filteredWords.filter((w) => {
      if (activeContexts.size) {
        const contexts = w.context || []
        const hasAll = Array.from(activeContexts).every((c) =>
          contexts.includes(c)
        )
        if (!hasAll) return false
      }
      if (activePracticeContexts.size) {
        const practices = w.contextForPractice || []
        const hasAll = Array.from(activePracticeContexts).every((c) =>
          practices.includes(c)
        )
        if (!hasAll) return false
      }
      return true
    })
  }, [activeContexts, activePracticeContexts, filteredWords])

  // Calcular paginación
  const totalPages = Math.ceil(visibleWords.length / ITEMS_PER_PAGE)

  const effectivePage = Math.min(currentPage, Math.max(0, totalPages - 1))
  const startIndex = effectivePage * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, visibleWords.length)
  const paginatedWords = useMemo(
    () => visibleWords.slice(startIndex, endIndex),
    [visibleWords, startIndex, endIndex]
  )

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({
    term: "",
    translation: "",
    notes: "",
  })
  const notesRef = useRef<HTMLTextAreaElement | null>(null)
  const [speakingKey, setSpeakingKey] = useState<string | null>(null)

  const selectAllChecked =
    paginatedWords.length > 0 &&
    paginatedWords.every((w) => selectedSet.has(w.id))

  const defaultSort = defaultSettings.sortBy

  const toggleExpandNotes = useCallback((id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const autoSizeNotes = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => {
    autoSizeNotes(notesRef.current)
  }, [editDraft.notes, editingId, autoSizeNotes])

  const onScore = useCallback(
    (id: string, delta: number) => {
      if (editingId && editingId !== id) {
        window.alert("Primero guarda o cancela la edición actual.")
        return
      }
      preserveScroll(() => dispatch(applyScore({ id, delta })))
    },
    [dispatch, editingId]
  )

  const onDelete = useCallback(
    (id: string) => {
      if (!window.confirm("¿Borrar palabra?")) return
      preserveScroll(() => dispatch(removeWord(id)))
    },
    [dispatch]
  )

  const startEdit = useCallback(
    (word: WordEntry) => {
      if (editingId && editingId !== word.id) {
        const ok = window.confirm(
          "Tienes otra fila en edición. ¿Descartar cambios y editar esta?"
        )
        if (!ok) return
      }
      setEditingId(word.id)
      setEditDraft({
        term: word.term,
        translation: word.translation,
        notes: word.notes,
      })
    },
    [editingId]
  )

  const cancelEdit = useCallback(() => setEditingId(null), [])

  const onSaveEdit = useCallback(
    (id: string) => {
      if (!editDraft.term.trim() || !editDraft.translation.trim()) {
        window.alert("Palabra y traducción son obligatorias.")
        return
      }
      preserveScroll(() =>
        dispatch(
          updateWord({
            id,
            term: editDraft.term.trim(),
            translation: editDraft.translation.trim(),
            notes: editDraft.notes,
          })
        )
      )
      setEditingId(null)
    },
    [dispatch, editDraft]
  )

  const selectAll = useCallback(
    (checked: boolean) => {
      if (!checked) {
        // Deseleccionar solo las palabras de la página actual
        const next = selectedIds.filter(
          (id) => !paginatedWords.find((w) => w.id === id)
        )
        dispatch(setSelectedIds(next))
        return
      }
      // Seleccionar solo las palabras de la página actual
      const next = new Set(selectedIds)
      paginatedWords.forEach((w) => next.add(w.id))
      dispatch(setSelectedIds(Array.from(next)))
    },
    [dispatch, selectedIds, paginatedWords]
  )

  const handleToggleSelect = useCallback(
    (id: string, checked: boolean) => {
      dispatch(toggleSelect({ id, checked }))
    },
    [dispatch]
  )

  const toggleSpeak = useCallback(
    (key: string, text: string, opts?: { sentencePerLine?: boolean }) => {
      if (isSpeaking) {
        stopSpeaking()
        if (speakingKey === key) {
          setSpeakingKey(null)
          return
        }
      }
      setSpeakingKey(key)
      speak(text, {
        ...opts,
        onEnd: () => setSpeakingKey(null),
        onError: () => setSpeakingKey(null),
      })
    },
    [isSpeaking, speakingKey, speak, stopSpeaking]
  )

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-lg backdrop-blur">
      <TableToolbar
        search={search}
        searchField={searchField}
        selectAllChecked={selectAllChecked}
        onSearchChange={(value) => {
          setCurrentPage(0)
          dispatch(setSearch(value))
        }}
        onSearchFieldChange={(field) => {
          setCurrentPage(0)
          dispatch(setSearchField(field))
        }}
        onSelectAll={selectAll}
      />

      <ContextFilters
        contextOptions={contextOptions}
        practiceOptions={contextPracticeOptions}
        activeContexts={activeContexts}
        activePracticeContexts={activePracticeContexts}
        availableContexts={availableContextTags}
        availablePracticeContexts={availablePracticeTags}
        onToggleContext={(ctx) => {
          setActiveContexts((prev) => {
            const next = new Set(prev)
            if (next.has(ctx)) next.delete(ctx)
            else next.add(ctx)
            return next
          })
          setCurrentPage(0)
        }}
        onTogglePracticeContext={(ctx) => {
          setActivePracticeContexts((prev) => {
            const next = new Set(prev)
            if (next.has(ctx)) next.delete(ctx)
            else next.add(ctx)
            return next
          })
          setCurrentPage(0)
        }}
      />

      <TableHeader
        sortBy={sortBy}
        defaultSort={defaultSort}
        onSortChange={(next: SortBy) =>
          preserveScroll(() => {
            setCurrentPage(0)
            dispatch(setSettings({ sortBy: next }))
          })
        }
      />

      {/* Información de paginación */}
      {visibleWords.length > ITEMS_PER_PAGE && (
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          Mostrando {startIndex + 1}-{endIndex} de {visibleWords.length}{" "}
          palabras
        </div>
      )}

      <div className="divide-y divide-slate-50">
        {paginatedWords.map((w) => {
          const score = scoresMap.get(w.id) || 0
          const isEditing = editingId === w.id
          const expanded = expandedNotes.has(w.id)
          return (
            <WordRow
              key={w.id}
              word={w}
              effectiveScore={score}
              isEditing={isEditing}
              expanded={expanded}
              selected={selectedSet.has(w.id)}
              editDraft={editDraft}
              isSpeaking={isSpeaking}
              speakingKey={speakingKey}
              notesRef={notesRef}
              onToggleSelect={(checked) => handleToggleSelect(w.id, checked)}
              onEditDraftChange={(field, value) =>
                setEditDraft((prev) => ({ ...prev, [field]: value }))
              }
              onAutoSizeNotes={autoSizeNotes}
              onToggleExpand={() => toggleExpandNotes(w.id)}
              onScore={(delta) => onScore(w.id, delta)}
              onStartEdit={() => startEdit(w)}
              onSaveEdit={() => onSaveEdit(w.id)}
              onCancelEdit={cancelEdit}
              onDelete={() => onDelete(w.id)}
              onToggleSpeak={toggleSpeak}
            />
          )
        })}

        {!visibleWords.length && (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            No hay palabras. Añade algunas para comenzar.
          </div>
        )}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
          <button
            onClick={() => setCurrentPage(Math.max(0, effectivePage - 1))}
            disabled={effectivePage === 0}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Página {effectivePage + 1} de {totalPages}
            </span>
            {totalPages <= 10 ? (
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                      effectivePage === i
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, effectivePage + 1))
            }
            disabled={effectivePage === totalPages - 1}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  )
}

export default WordsTablePaginated
