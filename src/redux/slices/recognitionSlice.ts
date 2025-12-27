import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { ToneVariant } from "+/shared/scoreTone"

export type TextHistoryItem = {
  id: string
  text: string
  createdAt: string
}

export type RecognitionSliceState = {
  recognitionText: string
  textHistory: TextHistoryItem[]
  showTextHistory: boolean
  toneVariant: ToneVariant
  previewFontSize: number
  previewLineHeight: number
  previewWordSpacing: number
}

const seedRecognitionText = "Hallo Danke bicicleta azul, Bitte Wasser y Buch con mesa."

const initialRecognitionText = seedRecognitionText
const initialTextHistory: TextHistoryItem[] = []

export const recognitionSlice = createSlice({
  name: "recognition",
  initialState: {
    recognitionText: initialRecognitionText,
    textHistory: initialTextHistory,
    showTextHistory: false,
    toneVariant: "mix",
    previewFontSize: 16,
    previewLineHeight: 2.0,
    previewWordSpacing: 1.5,
  } as RecognitionSliceState,
  reducers: {
    setToneVariant(state, action: PayloadAction<ToneVariant>) {
      state.toneVariant = action.payload
    },
    setPreviewFontSize(state, action: PayloadAction<number>) {
      state.previewFontSize = action.payload
    },
    setPreviewLineHeight(state, action: PayloadAction<number>) {
      state.previewLineHeight = action.payload
    },
    setPreviewWordSpacing(state, action: PayloadAction<number>) {
      state.previewWordSpacing = action.payload
    },
    setRecognitionText(state, action: PayloadAction<string>) {
      state.recognitionText = action.payload
    },
    setShowTextHistory(state, action: PayloadAction<boolean>) {
      state.showTextHistory = action.payload
    },
    toggleTextHistory(state) {
      state.showTextHistory = !state.showTextHistory
    },
    addTextHistory(state, action: PayloadAction<string>) {
      const text = action.payload.trim()
      if (!text) return
      const existingIndex = state.textHistory.findIndex(
        (item) => item.text.trim() === text
      )
      if (existingIndex !== -1) {
        const existing = state.textHistory[existingIndex]
        state.textHistory.splice(existingIndex, 1)
        state.textHistory.unshift({ ...existing, createdAt: new Date().toISOString() })
        return
      }
      state.textHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text,
        createdAt: new Date().toISOString(),
      })
    },
    removeTextHistory(state, action: PayloadAction<string>) {
      state.textHistory = state.textHistory.filter((item) => item.id !== action.payload)
    },
    setTextHistory(state, action: PayloadAction<TextHistoryItem[]>) {
      state.textHistory = action.payload
    },
  },
})

export const {
  addTextHistory,
  removeTextHistory,
  setRecognitionText,
  setShowTextHistory,
  setTextHistory,
  setToneVariant,
  setPreviewFontSize,
  setPreviewLineHeight,
  setPreviewWordSpacing,
  toggleTextHistory,
} = recognitionSlice.actions
