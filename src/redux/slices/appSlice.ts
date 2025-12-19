import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PracticeStats, SearchField, Settings, Word } from "+/types"
import { SETTINGS_KEY, STORE_KEY, buildQueue, defaultSettings, nowISO, safeParse } from "+/utils"

export type AppSliceState = {
  words: Word[]
  settings: Settings
  search: string
  searchField: SearchField
  selectedIds: string[]
  currentPracticeSelection: Word[]
  practiceQueue: string[]
  practiceIndex: number
  correctCount: number
  wrongCount: number
  practiceStats: PracticeStats
  summary: string | null
  alwaysShow: boolean
  reveal: boolean
}

const initialState: AppSliceState = {
  words: safeParse(localStorage.getItem(STORE_KEY), [] as Word[]),
  settings: {
    ...defaultSettings,
    ...safeParse<Partial<Settings>>(localStorage.getItem(SETTINGS_KEY), defaultSettings),
  },
  search: "",
  searchField: "term",
  selectedIds: [],
  currentPracticeSelection: [],
  practiceQueue: [],
  practiceIndex: 0,
  correctCount: 0,
  wrongCount: 0,
  practiceStats: {},
  summary: null,
  alwaysShow: false,
  reveal: false,
}

const finishSession = (state: AppSliceState) => {
  let deltaTotal = 0
  state.words = state.words.map((w) => {
    const stats = state.practiceStats[w.id]
    if (!stats) return w
    let delta = 0
    if (stats.correct >= 4) delta = 2
    else if (stats.correct === 3) delta = 1
    if (!delta) return w
    deltaTotal += delta
    return { ...w, baseScore: Math.max(0, (w.baseScore || 0) + delta) }
  })

  const total = state.practiceQueue.length
  const pct = total ? Math.round((state.correctCount / total) * 100) : 0
  state.summary = `Resumen: ${state.correctCount}/${total} correctas (${pct}%). Puntos agregados: +${deltaTotal}.`

  state.practiceQueue = []
  state.practiceIndex = 0
  state.currentPracticeSelection = []
  state.practiceStats = {}
  state.reveal = false
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<Partial<Settings>>) {
      state.settings = { ...state.settings, ...action.payload }
    },
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
    addWord(
      state,
      action: PayloadAction<Omit<Word, "baseScore" | "lastPracticedAt" | "createdAt">>
    ) {
      state.words.unshift({
        ...action.payload,
        baseScore: 2,
        lastPracticedAt: null,
        createdAt: nowISO(),
      })
    },
    deleteWord(state, action: PayloadAction<string>) {
      state.words = state.words.filter((w) => w.id !== action.payload)
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload)
    },
    updateWord(
      state,
      action: PayloadAction<{ id: string; term: string; translation: string; notes: string }>
    ) {
      state.words = state.words.map((w) =>
        w.id === action.payload.id
          ? {
              ...w,
              term: action.payload.term,
              translation: action.payload.translation,
              notes: action.payload.notes,
            }
          : w
      )
    },
    applyScore(state, action: PayloadAction<{ id: string; delta: number }>) {
      state.words = state.words.map((w) =>
        w.id === action.payload.id
          ? {
              ...w,
              baseScore: Math.max(0, (w.baseScore || 0) + action.payload.delta),
              lastPracticedAt: nowISO(),
            }
          : w
      )
    },
    setWordsAndSettings(state, action: PayloadAction<{ words: Word[]; settings: Settings }>) {
      state.words = action.payload.words
      state.settings = action.payload.settings
      state.selectedIds = []
    },
    wipeAll(state) {
      state.words = []
      state.selectedIds = []
    },
    startPractice(state, action: PayloadAction<string[]>) {
      const ids = action.payload
      const selected = ids
        .map((id) => state.words.find((w) => w.id === id))
        .filter((x): x is Word => Boolean(x))
      const stats = selected.reduce<PracticeStats>((acc, w) => {
        acc[w.id] = { correct: 0, total: 0 }
        return acc
      }, {})
      state.currentPracticeSelection = selected
      state.practiceStats = stats
      state.practiceQueue = buildQueue(
        ids,
        state.settings.practiceRounds || defaultSettings.practiceRounds
      )
      state.practiceIndex = 0
      state.correctCount = 0
      state.wrongCount = 0
      state.summary = null
      state.reveal = state.alwaysShow && state.practiceQueue.length > 0
    },
    markPractice(state, action: PayloadAction<{ ok: boolean }>) {
      const id = state.practiceQueue[state.practiceIndex]
      if (!id) return

      const nextIndex = state.practiceIndex + 1
      if (action.payload.ok) state.correctCount += 1
      else state.wrongCount += 1

      state.words = state.words.map((w) => (w.id === id ? { ...w, lastPracticedAt: nowISO() } : w))

      const prevStats = state.practiceStats[id] || { correct: 0, total: 0 }
      state.practiceStats[id] = {
        correct: prevStats.correct + (action.payload.ok ? 1 : 0),
        total: prevStats.total + 1,
      }

      state.practiceIndex = nextIndex
      state.reveal = state.alwaysShow && state.practiceQueue.length > 0

      if (nextIndex >= state.practiceQueue.length) finishSession(state)
    },
    exitPractice(state) {
      if (state.practiceQueue.length === 0) return
      finishSession(state)
    },
    setAlwaysShow(state, action: PayloadAction<boolean>) {
      state.alwaysShow = action.payload
      state.reveal = action.payload && state.practiceQueue.length > 0
    },
    toggleReveal(state) {
      if (state.alwaysShow) return
      state.reveal = !state.reveal
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
  deleteWord,
  updateWord,
  setSettings,
  setSearch,
  setSearchField,
  setSelectedIds,
  toggleSelect,
  setWordsAndSettings,
  wipeAll,
  startPractice,
  markPractice,
  exitPractice,
  setAlwaysShow,
  toggleReveal,
  touchLastPracticed,
} = appSlice.actions
