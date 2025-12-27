import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { PracticeStats } from "+/types"
import { buildQueue, defaultSettings } from "+/utils"

import { applyScoreDeltas, touchLastPracticed } from "./wordsSlice"
import type { AppDispatch, RootState } from "+/redux/store"

export type PracticeSliceState = {
  currentPracticeSelectionIds: string[]
  practiceQueue: string[]
  practiceIndex: number
  correctCount: number
  wrongCount: number
  practiceStats: PracticeStats
  summary: string | null
  alwaysShow: boolean
  reveal: boolean
  scoreDeltas: Array<{ id: string; delta: number }> | null
}

const finishSession = (state: PracticeSliceState) => {
  const deltas: Array<{ id: string; delta: number }> = []
  Object.entries(state.practiceStats).forEach(([id, stats]) => {
    let delta = 0
    if (stats.correct >= 4) delta = 2
    else if (stats.correct === 3) delta = 1
    if (delta) deltas.push({ id, delta })
  })

  const deltaTotal = deltas.reduce((acc, item) => acc + item.delta, 0)
  const total = state.practiceQueue.length
  const pct = total ? Math.round((state.correctCount / total) * 100) : 0
  state.summary = `Resumen: ${state.correctCount}/${total} correctas (${pct}%). Puntos agregados: +${deltaTotal}.`

  state.practiceQueue = []
  state.practiceIndex = 0
  state.currentPracticeSelectionIds = []
  state.practiceStats = {}
  state.reveal = false
  state.scoreDeltas = deltas.length ? deltas : null
}

export const practiceSlice = createSlice({
  name: "practice",
  initialState: {
    currentPracticeSelectionIds: [],
    practiceQueue: [],
    practiceIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    practiceStats: {},
    summary: null,
    alwaysShow: false,
    reveal: false,
    scoreDeltas: null,
  } as PracticeSliceState,
  reducers: {
    startPracticeInternal(
      state,
      action: PayloadAction<{ ids: string[]; rounds: number }>
    ) {
      const ids = action.payload.ids
      const stats = ids.reduce<PracticeStats>((acc, id) => {
        acc[id] = { correct: 0, total: 0 }
        return acc
      }, {})
      state.currentPracticeSelectionIds = ids
      state.practiceStats = stats
      state.practiceQueue = buildQueue(
        ids,
        action.payload.rounds || defaultSettings.practiceRounds
      )
      state.practiceIndex = 0
      state.correctCount = 0
      state.wrongCount = 0
      state.summary = null
      state.reveal = state.alwaysShow && state.practiceQueue.length > 0
      state.scoreDeltas = null
    },
    markPracticeInternal(state, action: PayloadAction<{ ok: boolean }>) {
      const id = state.practiceQueue[state.practiceIndex]
      if (!id) return

      const nextIndex = state.practiceIndex + 1
      if (action.payload.ok) state.correctCount += 1
      else state.wrongCount += 1

      const prevStats = state.practiceStats[id] || { correct: 0, total: 0 }
      state.practiceStats[id] = {
        correct: prevStats.correct + (action.payload.ok ? 1 : 0),
        total: prevStats.total + 1,
      }

      state.practiceIndex = nextIndex
      state.reveal = state.alwaysShow && state.practiceQueue.length > 0

      if (nextIndex >= state.practiceQueue.length) finishSession(state)
    },
    exitPracticeInternal(state) {
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
    clearScoreDeltas(state) {
      state.scoreDeltas = null
    },
  },
})

export const {
  clearScoreDeltas,
  exitPracticeInternal,
  markPracticeInternal,
  setAlwaysShow,
  startPracticeInternal,
  toggleReveal,
} = practiceSlice.actions

export const startPractice = (ids: string[]) => (dispatch: AppDispatch, getState: () => RootState) => {
  const rounds = getState().settings.practiceRounds || defaultSettings.practiceRounds
  dispatch(startPracticeInternal({ ids, rounds }))
}

export const markPractice = (payload: { ok: boolean }) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState()
  const currentId = state.practice.practiceQueue[state.practice.practiceIndex]
  dispatch(markPracticeInternal(payload))
  if (currentId) dispatch(touchLastPracticed(currentId))
  const after = getState().practice
  if (after.scoreDeltas) {
    dispatch(applyScoreDeltas(after.scoreDeltas))
    dispatch(clearScoreDeltas())
  }
}

export const exitPractice = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(exitPracticeInternal())
  const after = getState().practice
  if (after.scoreDeltas) {
    dispatch(applyScoreDeltas(after.scoreDeltas))
    dispatch(clearScoreDeltas())
  }
}
