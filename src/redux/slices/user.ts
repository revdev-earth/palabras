import { createSlice } from "@reduxjs/toolkit"

export type UserState = {
  id: string
  email: string
  name?: string | null
  lastName?: string | null
  role?: string | null
} | null

const initialState: UserState = null

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_state, action: { payload: UserState }) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions
