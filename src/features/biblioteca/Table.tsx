import { useEffect, useMemo, useRef, useState } from "react"

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

import { defaultSettings, filterAndSortWords } from "+/utils"

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

function WordsTable({ words }: { words: WordEntry[] }) {
  const dispatch = useDispatch()
  const selectedIds = useSelector((s) => s.words.selectedIds)
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const search = useSelector((s) => s.words.search)
  const searchField = useSelector((s) => s.words.searchField)
  const sortBy = useSelector((s) => s.settings.sortBy)
  const { speak, isSpeaking, stopSpeaking } = useSpeaker({ enabled: true })
  const [activeContexts, setActiveContexts] = useState<Set<string>>(new Set())
  const [activePracticeContexts, setActivePracticeContexts] = useState<Set<string>>(new Set())
  const filteredWords = useMemo(
    () => filterAndSortWords(words, search, sortBy, searchField),
    [words, search, sortBy, searchField]
  )
  const contextOptions = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) => (w.context || []).forEach((c) => set.add(c)))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [words])
  const contextPracticeOptions = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) => (w.contextForPractice || []).forEach((c) => set.add(c)))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [words])
  const visibleWords = useMemo(() => {
    return filteredWords.filter((w) => {
      if (activeContexts.size) {
        const contexts = w.context || []
        const hasAll = Array.from(activeContexts).every((c) => contexts.includes(c))
        if (!hasAll) return false
      }
      if (activePracticeContexts.size) {
        const practices = w.contextForPractice || []
        const hasAll = Array.from(activePracticeContexts).every((c) => practices.includes(c))
        if (!hasAll) return false
      }
      return true
    })
  }, [activeContexts, activePracticeContexts, filteredWords])

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ term: "", translation: "", notes: "" })
  const notesRef = useRef<HTMLTextAreaElement | null>(null)
  const [speakingKey, setSpeakingKey] = useState<string | null>(null)

  const selectAllChecked =
    visibleWords.length > 0 && visibleWords.every((w) => selectedSet.has(w.id))

  const defaultSort = defaultSettings.sortBy

  const toggleExpandNotes = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const autoSizeNotes = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    autoSizeNotes(notesRef.current)
  }, [editDraft.notes, editingId])

  const onScore = (id: string, delta: number) => {
    if (editingId && editingId !== id) {
      window.alert("Primero guarda o cancela la edición actual.")
      return
    }
    preserveScroll(() => dispatch(applyScore({ id, delta })))
  }

  const onDelete = (id: string) => {
    if (!window.confirm("¿Borrar palabra?")) return
    preserveScroll(() => dispatch(removeWord(id)))
  }

  const startEdit = (word: WordEntry) => {
    if (editingId && editingId !== word.id) {
      const ok = window.confirm("Tienes otra fila en edición. ¿Descartar cambios y editar esta?")
      if (!ok) return
    }
    setEditingId(word.id)
    setEditDraft({ term: word.term, translation: word.translation, notes: word.notes })
  }

  const cancelEdit = () => setEditingId(null)

  const onSaveEdit = (id: string) => {
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
  }

  const selectAll = (checked: boolean) => {
    if (!checked) {
      const next = selectedIds.filter((id) => !visibleWords.find((w) => w.id === id))
      dispatch(setSelectedIds(next))
      return
    }
    const next = new Set(selectedIds)
    visibleWords.forEach((w) => next.add(w.id))
    dispatch(setSelectedIds(Array.from(next)))
  }

  const toggleSpeak = (key: string, text: string, opts?: { sentencePerLine?: boolean }) => {
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
  }

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-lg backdrop-blur">
      <TableToolbar
        search={search}
        searchField={searchField}
        selectAllChecked={selectAllChecked}
        onSearchChange={(value) => dispatch(setSearch(value))}
        onSearchFieldChange={(field) => dispatch(setSearchField(field))}
        onSelectAll={selectAll}
      />

      <ContextFilters
        contextOptions={contextOptions}
        practiceOptions={contextPracticeOptions}
        activeContexts={activeContexts}
        activePracticeContexts={activePracticeContexts}
        onToggleContext={(ctx) =>
          setActiveContexts((prev) => {
            const next = new Set(prev)
            if (next.has(ctx)) next.delete(ctx)
            else next.add(ctx)
            return next
          })
        }
        onTogglePracticeContext={(ctx) =>
          setActivePracticeContexts((prev) => {
            const next = new Set(prev)
            if (next.has(ctx)) next.delete(ctx)
            else next.add(ctx)
            return next
          })
        }
      />

      <TableHeader
        sortBy={sortBy}
        defaultSort={defaultSort}
        onSortChange={(next: SortBy) =>
          preserveScroll(() => dispatch(setSettings({ sortBy: next })))
        }
      />

      <div className="divide-y divide-slate-50">
        {visibleWords.map((w) => {
          const isEditing = editingId === w.id
          const expanded = expandedNotes.has(w.id)
          return (
            <WordRow
              key={w.id}
              word={w}
              isEditing={isEditing}
              expanded={expanded}
              selected={selectedSet.has(w.id)}
              editDraft={editDraft}
              isSpeaking={isSpeaking}
              speakingKey={speakingKey}
              notesRef={notesRef}
              onToggleSelect={(checked) =>
                dispatch(toggleSelect({ id: w.id, checked }))
              }
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
    </section>
  )
}

export default WordsTable
