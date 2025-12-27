import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux"
import { HYDRATE_ACTION_TYPE, store, type AppDispatch, type RootState } from "+/redux/store"
import { WORDS_STORE_KEY as REDUX_KEY_LOCAL_STORAGE } from "+/constants"

export const useDispatch = () => useReduxDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export { store, HYDRATE_ACTION_TYPE, REDUX_KEY_LOCAL_STORAGE }
