import type { AnyAction, Middleware } from "@reduxjs/toolkit"

import type { Settings } from "+/types"
import type { WordEntry } from "+/redux/slices/wordsSlice"
import {
  addWord,
  applyScore,
  applyScoreDeltas,
  removeWord,
  setWords,
  touchLastPracticed,
  updateWord,
  upsertWord,
} from "+/redux/slices/wordsSlice"
import { setSettings } from "+/redux/slices/settingsSlice"
import {
  addTextHistory,
  removeTextHistory,
  setRecognitionText,
  setTextHistory,
  type TextHistoryItem,
} from "+/redux/slices/recognitionSlice"
import { syncSettings, syncWordProgress, syncRecognitionState } from "+/actions/sync"

type PendingSync = {
  words?: WordEntry[]
  settings?: Settings
  recognition?: { recognitionText: string; textHistory: TextHistoryItem[] }
}

const HYDRATE_ACTION_TYPE = "HYDRATE"

const findByTerm = (words: WordEntry[], term?: string) => {
  if (!term) return null
  const key = term.trim().toLowerCase()
  if (!key) return null
  return words.find((word) => word.term.trim().toLowerCase() === key) || null
}

export const syncMiddleware: Middleware = (storeApi) => {
  const pending: PendingSync = {}
  let scheduled = false

  const flush = () => {
    scheduled = false
    const words = pending.words
    const settings = pending.settings
    const recognition = pending.recognition

    delete pending.words
    delete pending.settings
    delete pending.recognition

    if (!words && !settings && !recognition) return

    void (async () => {
      try {
        if (words) await syncWordProgress(words)
        if (settings) await syncSettings(settings)
        if (recognition)
          await syncRecognitionState({
            recognitionText: recognition.recognitionText,
            textHistory: recognition.textHistory,
          })
      } catch (error) {
        console.error("Error syncing state:", error)
      }
    })()
  }

  const scheduleFlush = () => {
    if (scheduled) return
    scheduled = true
    const schedule =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb: () => void) => window.requestIdleCallback(cb)
        : (cb: () => void) => window.setTimeout(cb, 350)
    schedule(flush)
  }

  return (next) => (action) => {
    const result = next(action)

    if (typeof window === "undefined") return result
    const actionType = (action as AnyAction).type
    if (actionType === HYDRATE_ACTION_TYPE) return result

    const state = storeApi.getState()
    if (!state.auth?.isAuthenticated || !state.user?.id) return result

    const words = state.words?.words || []
    let dirty = false

    if (addWord.match(action)) {
      const word =
        words.find((item: WordEntry) => item.id === action.payload?.id) ||
        findByTerm(words, action.payload?.term)
      if (word) {
        pending.words = words
        dirty = true
      }
    } else if (upsertWord.match(action)) {
      const word = findByTerm(words, action.payload?.term) || findByTerm(words, action.payload?.previousTerm)
      if (word) {
        pending.words = words
        dirty = true
      }
    } else if (updateWord.match(action)) {
      const word = words.find((item: WordEntry) => item.id === action.payload.id)
      if (word) {
        pending.words = words
        dirty = true
      }
    } else if (setWords.match(action)) {
      pending.words = words
      dirty = true
    } else if (removeWord.match(action)) {
      pending.words = words
      dirty = true
    } else if (applyScore.match(action) || touchLastPracticed.match(action)) {
      const targetId = applyScore.match(action) ? action.payload.id : action.payload
      const word = words.find((item: WordEntry) => item.id === targetId)
      if (word) {
        pending.words = words
        dirty = true
      }
    } else if (applyScoreDeltas.match(action)) {
      action.payload.forEach((item: { id: string }) => {
        const word = words.find((entry: WordEntry) => entry.id === item.id)
        if (!word) return
        dirty = true
      })
      if (dirty) pending.words = words
    }

    if (setSettings.match(action)) {
      pending.settings = state.settings
      dirty = true
    }

    if (
      setRecognitionText.match(action) ||
      addTextHistory.match(action) ||
      removeTextHistory.match(action) ||
      setTextHistory.match(action)
    ) {
      pending.recognition = {
        recognitionText: state.recognition.recognitionText,
        textHistory: state.recognition.textHistory,
      }
      dirty = true
    }

    if (dirty) scheduleFlush()
    return result
  }
}
