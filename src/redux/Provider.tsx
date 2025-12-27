"use client"

import { useEffect, type ReactNode } from "react"
import { Provider } from "react-redux"

import { HYDRATE_ACTION_TYPE, REDUX_KEY_LOCAL_STORAGE, store, useDispatch } from "."
import { initialState, type State } from "./store"
import { safeParse } from "+/utils"

interface Props {
  children: ReactNode
}

const Hydrate = ({ children }: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const localStorageState = safeParse(
      localStorage.getItem(REDUX_KEY_LOCAL_STORAGE),
      null as State | null
    )
    const storedWords = safeParse(
      localStorage.getItem(`${REDUX_KEY_LOCAL_STORAGE}:words`),
      null as State["words"]["words"] | null
    )
    const persistedState = (() => {
      if (!localStorageState) return initialState
      const legacy = localStorageState as unknown as {
        words?: unknown
        selectedIds?: unknown
        textHistory?: unknown
        settings?: unknown
      }
      if (Array.isArray(legacy.words)) {
        return {
          ...initialState,
          words: {
            ...initialState.words,
            words: legacy.words,
            selectedIds: Array.isArray(legacy.selectedIds) ? legacy.selectedIds : [],
          },
          recognition: {
            ...initialState.recognition,
            textHistory: Array.isArray(legacy.textHistory) ? legacy.textHistory : [],
          },
          settings: {
            ...initialState.settings,
            ...(legacy.settings && typeof legacy.settings === "object" ? legacy.settings : {}),
          },
        }
      }
      const next = { ...initialState, ...localStorageState }
      if (storedWords) {
        next.words = { ...next.words, words: storedWords }
      }
      return next
    })()
    dispatch({ type: HYDRATE_ACTION_TYPE, payload: persistedState })
  }, [dispatch])

  return children
}

const ReduxProvider = ({ children }: Props) => (
  <Provider store={store}>
    <Hydrate>{children}</Hydrate>
  </Provider>
)

export default ReduxProvider
