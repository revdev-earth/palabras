import { createSlice } from "@reduxjs/toolkit"

type AuthModalTab = "login" | "register"
type AuthFlowState = "idle" | "start" | "loading" | "success"

export type AuthState = {
  isAuthenticated: boolean
  authModalOpen: boolean
  authModalTab: AuthModalTab
  resetPasswordModalOpen: boolean
  loginState: AuthFlowState
  registerState: AuthFlowState
  codeVerificationState: AuthFlowState
  verificationExpiresAt: number | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  authModalOpen: false,
  authModalTab: "login",
  resetPasswordModalOpen: false,
  loginState: "idle",
  registerState: "idle",
  codeVerificationState: "idle",
  verificationExpiresAt: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated(state, action: { payload: boolean }) {
      state.isAuthenticated = action.payload
    },
    setAuthModalOpen(
      state,
      action: { payload: { open: boolean; tab?: AuthModalTab } }
    ) {
      state.authModalOpen = action.payload.open
      if (action.payload.tab) state.authModalTab = action.payload.tab
    },
    setResetPasswordModalOpen(state, action: { payload: boolean }) {
      state.resetPasswordModalOpen = action.payload
    },
    setLoginState(state, action: { payload: AuthFlowState }) {
      state.loginState = action.payload
    },
    setRegisterState(state, action: { payload: AuthFlowState }) {
      state.registerState = action.payload
    },
    setCodeVerificationState(state, action: { payload: AuthFlowState }) {
      state.codeVerificationState = action.payload
    },
    setAuthVerificationExpires(state, action: { payload: number | null }) {
      state.verificationExpiresAt = action.payload
    },
    resetAuthProcess(state) {
      state.authModalOpen = false
      state.authModalTab = "login"
      state.resetPasswordModalOpen = false
      state.loginState = "idle"
      state.registerState = "idle"
      state.codeVerificationState = "idle"
      state.verificationExpiresAt = null
    },
  },
})

export const {
  setIsAuthenticated,
  setAuthModalOpen,
  setResetPasswordModalOpen,
  setLoginState,
  setRegisterState,
  setCodeVerificationState,
  setAuthVerificationExpires,
  resetAuthProcess,
} = authSlice.actions
