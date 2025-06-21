import { getPoemFeed } from "@/lib/api/poem";
import { Poem } from "@/types/poem";
import { createAsyncThunk } from "@reduxjs/toolkit";

type FetchPoemsResult = { poems: Poem[]; hasMore: boolean }
type FetchPoemsArgument = { offset?: number; limit?: number; reset?: boolean }

export const fetchPoemFeed = createAsyncThunk<
  FetchPoemsResult,
  FetchPoemsArgument,
  { rejectValue: string }
>(
  'poemFeed/fetchPoemFeed',
  async ({ offset = 0, limit = 20, reset = false }, thunkAPI) => {
    try {
      const poems = await getPoemFeed(offset, limit)
      const hasMore = poems.length === limit

      return { 
        poems, 
        hasMore,
        reset 
      } as any
    } catch (error: any) {
      console.error('Failed to fetch poem feed:', error)
      return thunkAPI.rejectWithValue(
        error?.message || 'Failed to load poems. Please try again.'
      )
    }
  }
)
