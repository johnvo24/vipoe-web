import { createAsyncThunk } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
import { getProfile } from "@/lib/api/auth"
import { User } from "@/types/auth"
import { AppThunk } from "@/lib/store"
import { resetAuth } from "./authSlice"
import { resetFeed } from "../poem/poemFeedSlice"
import { resetCollection } from "../collection/collectionSlice"

export const fetchUser = createAsyncThunk<
  User,
  string | null, // token
  { rejectValue: string }
>(
  "auth/fetchUser",
  async (token, thunkAPI) => {
    try {
      if (!token) return thunkAPI.rejectWithValue("No access token")
      const payload = jwtDecode<{ exp: number }>(token)
      if (payload.exp * 1000 < Date.now()) {
        return thunkAPI.rejectWithValue("Access token expired")
      }
      const user = await getProfile(token)
      return user
    } catch {
      return thunkAPI.rejectWithValue("Invalid access token or failed to fetch profile")
    }
  }
)

export const logout = (): AppThunk => {
  return (dispatch) => {
    console.log("Logging out...")
    localStorage.removeItem("token")
    dispatch(resetAuth())
    dispatch(resetFeed())
    dispatch(resetCollection())
  }
}