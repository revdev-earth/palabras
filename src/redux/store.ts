import { configureStore } from "@reduxjs/toolkit"

import { appSlice } from "+/redux/slices/appSlice"
import { v2Slice } from "+/redux/slices/v2Slice"

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    v2Words: v2Slice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
