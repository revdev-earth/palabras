import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { nowISO, safeParse } from "+/utils"

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
  },
})

export const { addV2Word, setV2Words } = v2Slice.actions
