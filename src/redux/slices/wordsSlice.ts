import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { SearchField } from "+/types"
import { genId, nowISO } from "+/utils"

export type WordEntry = {
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

export type WordsSliceState = {
  words: WordEntry[]
  search: string
  searchField: SearchField
  selectedIds: string[]
}

const seedWords: WordEntry[] = [
  {
    id: "de-hallo",
    term: "Hallo",
    translation: "Hola",
    notes: "saludo informal",
    baseScore: 2,
    lastPracticedAt: null,
    createdAt: nowISO(),
    context: [],
    contextForPractice: [],
  },
  {
    id: "de-danke",
    term: "Danke",
    translation: "Gracias",
    notes: "",
    baseScore: 2,
    lastPracticedAt: null,
    createdAt: nowISO(),
    context: [],
    contextForPractice: [],
  },
  {
    id: "de-bitte",
    term: "Bitte",
    translation: "Por favor",
    notes: "tambien se usa como 'de nada'",
    baseScore: 2,
    lastPracticedAt: null,
    createdAt: nowISO(),
    context: [],
    contextForPractice: [],
  },
  {
    id: "de-wasser",
    term: "Wasser",
    translation: "Agua",
    notes: "",
    baseScore: 2,
    lastPracticedAt: null,
    createdAt: nowISO(),
    context: [],
    contextForPractice: [],
  },
  {
    id: "de-buch",
    term: "Buch",
    translation: "Libro",
    notes: "",
    baseScore: 2,
    lastPracticedAt: null,
    createdAt: nowISO(),
    context: [],
    contextForPractice: [],
  },
]

const initialWords = seedWords
const initialSelectedIds: string[] = []

export const wordsSlice = createSlice({
  name: "words",
  initialState: {
    words: initialWords,
    search: "",
    searchField: "term",
    selectedIds: initialSelectedIds,
  } as WordsSliceState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setSearchField(state, action: PayloadAction<SearchField>) {
      state.searchField = action.payload
    },
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload
    },
    toggleSelect(state, action: PayloadAction<{ id: string; checked: boolean }>) {
      const next = new Set(state.selectedIds)
      if (action.payload.checked) next.add(action.payload.id)
      else next.delete(action.payload.id)
      state.selectedIds = Array.from(next)
    },
    setWords(state, action: PayloadAction<WordEntry[]>) {
      state.words = action.payload
      state.selectedIds = []
    },
    addWord(
      state,
      action: PayloadAction<Omit<WordEntry, "baseScore" | "lastPracticedAt" | "createdAt">>
    ) {
      state.words.unshift({
        ...action.payload,
        baseScore: 2,
        lastPracticedAt: null,
        createdAt: nowISO(),
      })
    },
    upsertWord(
      state,
      action: PayloadAction<
        Omit<WordEntry, "id" | "baseScore" | "lastPracticedAt" | "createdAt"> & {
          previousTerm?: string
        }
      >
    ) {
      const term = action.payload.term.trim()
      if (!term) return
      const key = term.toLowerCase()
      const previousKey = action.payload.previousTerm?.trim().toLowerCase()
      let index = previousKey
        ? state.words.findIndex((word) => word.term.trim().toLowerCase() === previousKey)
        : -1
      if (index === -1) {
        index = state.words.findIndex((word) => word.term.trim().toLowerCase() === key)
      }
      if (index === -1) {
        state.words.unshift({
          id: genId(),
          term,
          translation: action.payload.translation.trim(),
          notes: action.payload.notes,
          context: action.payload.context,
          contextForPractice: action.payload.contextForPractice,
          baseScore: 2,
          lastPracticedAt: null,
          createdAt: nowISO(),
        })
        return
      }
      const duplicateIndex = state.words.findIndex(
        (word, idx) => idx !== index && word.term.trim().toLowerCase() === key
      )
      const incoming = {
        term,
        translation: action.payload.translation.trim(),
        notes: action.payload.notes,
        context: action.payload.context,
        contextForPractice: action.payload.contextForPractice,
      }
      if (duplicateIndex !== -1) {
        const target = state.words[duplicateIndex]
        state.words[duplicateIndex] = {
          ...target,
          ...incoming,
        }
        state.words.splice(index, 1)
        return
      }
      const current = state.words[index]
      state.words[index] = {
        ...current,
        ...incoming,
      }
    },
    updateWord(
      state,
      action: PayloadAction<{ id: string; term: string; translation: string; notes: string }>
    ) {
      const term = action.payload.term.trim()
      const translation = action.payload.translation.trim()
      if (!term || !translation) return
      state.words = state.words.map((w) =>
        w.id === action.payload.id
          ? {
              ...w,
              term,
              translation,
              notes: action.payload.notes,
            }
          : w
      )
    },
    removeWord(state, action: PayloadAction<string>) {
      state.words = state.words.filter((word) => word.id !== action.payload)
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload)
    },
    applyScore(state, action: PayloadAction<{ id: string; delta: number }>) {
      const index = state.words.findIndex((word) => word.id === action.payload.id)
      if (index === -1) return
      const current = state.words[index]
      const nextScore = Math.max(0, (current.baseScore || 0) + action.payload.delta)
      state.words[index] = {
        ...current,
        baseScore: nextScore,
        lastPracticedAt: nowISO(),
      }
    },
    applyScoreDeltas(state, action: PayloadAction<Array<{ id: string; delta: number }>>) {
      if (!action.payload.length) return
      const deltaMap = new Map(action.payload.map((item) => [item.id, item.delta]))
      state.words = state.words.map((word) => {
        const delta = deltaMap.get(word.id)
        if (!delta) return word
        return { ...word, baseScore: Math.max(0, (word.baseScore || 0) + delta) }
      })
    },
    touchLastPracticed(state, action: PayloadAction<string>) {
      state.words = state.words.map((w) =>
        w.id === action.payload ? { ...w, lastPracticedAt: nowISO() } : w
      )
    },
  },
})

export const {
  addWord,
  applyScore,
  applyScoreDeltas,
  removeWord,
  setSearch,
  setSearchField,
  setSelectedIds,
  setWords,
  toggleSelect,
  touchLastPracticed,
  updateWord,
  upsertWord,
} = wordsSlice.actions
