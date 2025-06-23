import { getPoemFeed } from "@/lib/api/poem";
import { Poem } from "@/types/poem";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectToken } from "../auth/authSlice";
import type { RootState } from "@/lib/store";
import { logout } from "../auth/authThunks";

type FetchPoemsResult = { poems: Poem[]; hasMore: boolean }
type FetchPoemsArgument = { offset?: number; limit?: number; reset?: boolean; }

export const fetchPoemFeed = createAsyncThunk<
  FetchPoemsResult,
  FetchPoemsArgument,
  { state: RootState; rejectValue: string }
>(
  'poemFeed/fetchPoemFeed',
  async ({ offset = 0, limit = 20, reset = false}, thunkAPI) => {
    try {
      const token = selectToken(thunkAPI.getState())
      const poems = await getPoemFeed(offset, limit, token)
      const hasMore = poems.length === limit

      return { 
        poems, 
        hasMore
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // Logout
        thunkAPI.dispatch(logout())
        return thunkAPI.rejectWithValue('LOGGED_OUT')
      } else {
        console.error('Error fetching poems:', error)
        return thunkAPI.rejectWithValue(
          error?.message || 'Failed to load poems. Please try again.'
        )
      }
    }
  }
)
