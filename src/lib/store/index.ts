import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import poemFeedReducer from './poem/poemFeedSlice'
import collectionReducer from './collection/collectionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poemFeed: poemFeedReducer,
    collection: collectionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>