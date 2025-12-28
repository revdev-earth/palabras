import {
  type Middleware,
  PayloadAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit"

import { practiceSlice } from "+/redux/slices/practiceSlice"
import { recognitionSlice } from "+/redux/slices/recognitionSlice"
import { settingsSlice } from "+/redux/slices/settingsSlice"
import { wordsSlice } from "+/redux/slices/wordsSlice"
import { authSlice, resetAuthProcess, setIsAuthenticated } from "+/redux/slices/auth"
import { userSlice } from "+/redux/slices/user"
import { WORDS_STORE_KEY } from "+/constants"
import { genId } from "+/utils"
import type { WordEntry } from "+/redux/slices/wordsSlice"
import { syncMiddleware } from "+/redux/syncMiddleware"

export const HYDRATE_ACTION_TYPE = "HYDRATE"

const rootReducer = combineReducers({
  words: wordsSlice.reducer,
  practice: practiceSlice.reducer,
  settings: settingsSlice.reducer,
  recognition: recognitionSlice.reducer,
  auth: authSlice.reducer,
  user: userSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type State = RootState

const normalizeWordIds = (words: WordEntry[]) => {
  const seen = new Set<string>()
  return words.map((word) => {
    let id = word.id
    if (!id || seen.has(id)) id = genId()
    seen.add(id)
    return id === word.id ? word : { ...word, id }
  })
}

const reducer = (state: State | undefined, action: PayloadAction<State>) => {
  if (action.type === HYDRATE_ACTION_TYPE) {
    const next = {
      ...state,
      ...action.payload,
    }
    const incomingWords = action.payload?.words?.words
    if (incomingWords?.length) {
      next.words = { ...next.words, words: normalizeWordIds(incomingWords) }
    }
    return next
  }
  return rootReducer(state, action)
}

const authResetMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action)
  if (setIsAuthenticated.match(action)) {
    const authState = storeApi.getState().auth
    if (authState.isAuthenticated === false) {
      storeApi.dispatch(resetAuthProcess())
    }
  }
  return result
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authResetMiddleware, syncMiddleware),
})

export type AppDispatch = typeof store.dispatch
export const initialState: State = store.getState()

if (typeof window !== "undefined") {
  const WORDS_STORE_KEY_WORDS = `${WORDS_STORE_KEY}:words`
  let saveScheduled = false
  let lastWordsSerialized: string | null = null
  let lastMetaSerialized: string | null = null
  let lastWordsRef: State["words"]["words"] | null = null
  store.subscribe(() => {
    if (saveScheduled) return
    saveScheduled = true
    const schedule =
      "requestIdleCallback" in window
        ? (cb: () => void) => window.requestIdleCallback(cb)
        : (cb: () => void) => window.setTimeout(cb, 200)
    schedule(() => {
      saveScheduled = false
      const state = store.getState()
      if (state.auth?.isAuthenticated && state.user?.id) return
      if (lastWordsRef !== state.words.words) {
        lastWordsRef = state.words.words
        const wordsSerialized = JSON.stringify(state.words.words)
        if (wordsSerialized !== lastWordsSerialized) {
          lastWordsSerialized = wordsSerialized
          window.localStorage.setItem(WORDS_STORE_KEY_WORDS, wordsSerialized)
        }
      }
      const metaPayload = {
        words: {
          selectedIds: state.words.selectedIds,
          search: state.words.search,
          searchField: state.words.searchField,
        },
        settings: state.settings,
        recognition: state.recognition,
      }
      const metaSerialized = JSON.stringify(metaPayload)
      if (metaSerialized === lastMetaSerialized) return
      lastMetaSerialized = metaSerialized
      window.localStorage.setItem(WORDS_STORE_KEY, metaSerialized)
    })
  })
}
