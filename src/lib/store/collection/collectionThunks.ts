import { getPoemInCollection } from '@/lib/api/poem'
import { Poem } from '@/types/poem'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectToken } from '../auth/authSlice'
import type { RootState } from '@/lib/store'
import { logout } from '../auth/authThunks'
import { AxiosError } from 'axios'

type FetchCollectionResult = { poems: Poem[]; hasMore: boolean }
type FetchCollectionArgument = { offset?: number; limit?: number; reset?: boolean }

export const fetchCollection = createAsyncThunk<
  FetchCollectionResult,
  FetchCollectionArgument,
  { state: RootState; rejectValue: string }
>(
  'collection/fetchCollection',
  async ({ offset = 0, limit = 20, reset = false }, thunkAPI) => {
    try {
      const token = selectToken(thunkAPI.getState())
      if (!token) {
        thunkAPI.dispatch(logout())
        return thunkAPI.rejectWithValue('NOT_AUTH')
      }
      const poems = await getPoemInCollection(offset, limit, token)
      const hasMore = poems.length === limit

      return { poems, hasMore, reset }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        // Logout
        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue('NOT_AUTH');
      } else {
        console.error('Error fetching poems:', axiosError);
        return thunkAPI.rejectWithValue(
          axiosError.message || 'Failed to load collection'
        );
      }
    }
  }
)