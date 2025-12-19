import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { genId, nowISO, safeParse } from "+/utils"

export type V2Word = {
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

export type V2SliceState = {
  words: V2Word[]
}

export const V2_STORE_KEY = "vocab-tracker-v2"

const seedWords: V2Word[] = [
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

const storedWords = safeParse(localStorage.getItem(V2_STORE_KEY), [] as V2Word[])
const initialWords = storedWords.length ? storedWords : seedWords

export const v2Slice = createSlice({
  name: "v2Words",
  initialState: {
    words: initialWords,
  } as V2SliceState,
  reducers: {
    setV2Words(state, action: PayloadAction<V2Word[]>) {
      state.words = action.payload
    },
    addV2Word(
      state,
      action: PayloadAction<Omit<V2Word, "baseScore" | "lastPracticedAt" | "createdAt">>
    ) {
      state.words.unshift({
        ...action.payload,
        baseScore: 2,
        lastPracticedAt: null,
        createdAt: nowISO(),
      })
    },
    upsertV2Word(
      state,
      action: PayloadAction<
        Omit<V2Word, "id" | "baseScore" | "lastPracticedAt" | "createdAt"> & {
          previousTerm?: string
        }
      >
    ) {
      const term = action.payload.term.trim()
      if (!term) return
      const key = term.toLowerCase()
      const previousKey = action.payload.previousTerm?.trim().toLowerCase()
      let index =
        previousKey ? state.words.findIndex((word) => word.term.trim().toLowerCase() === previousKey) : -1
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
  },
})

export const { addV2Word, setV2Words, upsertV2Word } = v2Slice.actions
