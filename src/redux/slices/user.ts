import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserState = {
  id: string
  email: string
  name?: string | null
  lastName?: string | null
  role?: string | null
  canUploadWords?: boolean
} | null

const initialState: UserState = null

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserState,
  reducers: {
    setUser(_state, action: PayloadAction<UserState>) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions
