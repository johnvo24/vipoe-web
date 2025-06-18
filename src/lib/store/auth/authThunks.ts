import { createAsyncThunk } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
import { getProfile } from "@/lib/api/auth"
import { User } from "@/types/auth"

export const fetchUser = createAsyncThunk<
  User,
  string, // token
  { rejectValue: string }
>(
  "auth/fetchUser",
  async (token, thunkAPI) => {
    try {
      const payload: any = jwtDecode(token)
      if (payload.exp * 1000 < Date.now()) {
        return thunkAPI.rejectWithValue("Token expired")
      }
      const user = await getProfile(token)
      return user
    } catch {
      return thunkAPI.rejectWithValue("Invalid token or failed to fetch profile")
    }
  }
)