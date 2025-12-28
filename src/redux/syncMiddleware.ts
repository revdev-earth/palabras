import type { Middleware } from "@reduxjs/toolkit"

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
import {
  deleteWordLibrary,
  syncSettings,
  syncWordLibrary,
  syncWordProgress,
  syncRecognitionState,
} from "+/actions/sync"

type ProgressChange = {
  id: string
  baseScore: number
  lastPracticedAt: string | null
}

type PendingSync = {
  library: Map<string, WordEntry>
  progress: Map<string, ProgressChange>
  deleted: Set<string>
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
  const pending: PendingSync = {
    library: new Map(),
    progress: new Map(),
    deleted: new Set(),
  }
  let scheduled = false

  const flush = () => {
    scheduled = false
    const deletedIds = Array.from(pending.deleted)
    const library = Array.from(pending.library.values())
    const progress = Array.from(pending.progress.values())
    const settings = pending.settings
    const recognition = pending.recognition

    pending.deleted.clear()
    pending.library.clear()
    pending.progress.clear()
    delete pending.settings
    delete pending.recognition

    if (
      !deletedIds.length &&
      !library.length &&
      !progress.length &&
      !settings &&
      !recognition
    )
      return

    void (async () => {
      try {
        if (deletedIds.length) await deleteWordLibrary(deletedIds)
        if (library.length) await syncWordLibrary(library)
        if (progress.length) await syncWordProgress(progress)
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
    if (action.type === HYDRATE_ACTION_TYPE) return result

    const state = storeApi.getState()
    if (!state.auth?.isAuthenticated || !state.user?.id) return result

    const words = state.words?.words || []
    let dirty = false

    if (addWord.match(action)) {
      const word =
        words.find((item: WordEntry) => item.id === action.payload?.id) ||
        findByTerm(words, action.payload?.term)
      if (word) {
        pending.library.set(word.id, word)
        pending.progress.set(word.id, {
          id: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        })
        dirty = true
      }
    } else if (upsertWord.match(action)) {
      const word =
        words.find((item: WordEntry) => item.id === action.payload?.id) ||
        findByTerm(words, action.payload?.term) ||
        findByTerm(words, action.payload?.previousTerm)
      if (word) {
        pending.library.set(word.id, word)
        pending.progress.set(word.id, {
          id: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        })
        dirty = true
      }
    } else if (updateWord.match(action)) {
      const word = words.find((item: WordEntry) => item.id === action.payload.id)
      if (word) {
        pending.library.set(word.id, word)
        dirty = true
      }
    } else if (setWords.match(action)) {
      action.payload.forEach((word: WordEntry) => {
        pending.library.set(word.id, word)
        pending.progress.set(word.id, {
          id: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        })
      })
      dirty = action.payload.length > 0
    } else if (removeWord.match(action)) {
      pending.deleted.add(action.payload)
      pending.library.delete(action.payload)
      pending.progress.delete(action.payload)
      dirty = true
    } else if (applyScore.match(action) || touchLastPracticed.match(action)) {
      const word = words.find((item) => item.id === action.payload.id)
      if (word) {
        pending.progress.set(word.id, {
          id: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        })
        dirty = true
      }
    } else if (applyScoreDeltas.match(action)) {
      action.payload.forEach((item: { id: string }) => {
        const word = words.find((entry: WordEntry) => entry.id === item.id)
        if (!word) return
        pending.progress.set(word.id, {
          id: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        })
        dirty = true
      })
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
