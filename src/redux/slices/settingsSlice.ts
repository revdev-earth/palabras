import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { Settings } from "+/types"
import { defaultSettings } from "+/utils"

export type SettingsSliceState = Settings

const initialSettings: Settings = {
  ...defaultSettings,
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings as SettingsSliceState,
  reducers: {
    setSettings(state, action: PayloadAction<Partial<Settings>>) {
      return { ...state, ...action.payload }
    },
  },
})

export const { setSettings } = settingsSlice.actions
