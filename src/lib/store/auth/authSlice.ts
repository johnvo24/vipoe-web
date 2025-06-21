import { AuthState, User } from "@/types/auth"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchUser } from "./authThunks"


const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: "auth", // prefix for action types
  initialState, // initial state of the slice
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload,
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    builder
    // Handle the fetchUser async thunk
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.loading = false
        state.isAuthenticated = true
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null
        state.token = null
        state.loading = false
        state.error = action.payload || "Unknown error"
        state.isAuthenticated = false
      })
    // Handle other async thunks ...
  }
})

// Selectors
export const selectAuthState = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

export const { logout, setToken } = authSlice.actions
export default authSlice.reducer