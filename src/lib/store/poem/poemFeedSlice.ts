import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Poem, PoemFeedState } from '@/types/poem'
import { fetchPoemFeed } from './poemFeedThunks'

const initialState: PoemFeedState = {
  poems: [],
  loading: true,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 20,
  isInitialLoading: true
}

const poemFeedSlice = createSlice({
  name: 'poemFeed',
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.poems = []
      state.offset = 0
      state.hasMore = true
      state.error = null
      state.loading = false
      state.isInitialLoading = true
    },
    updatePoem: (state, action: PayloadAction<{ id: string; updates: Partial<Poem> }>) => {
      const { id, updates } = action.payload
      const poemIndex = state.poems.findIndex(poem => poem.id === Number(id))
      if (poemIndex !== -1) {
        state.poems[poemIndex] = { ...state.poems[poemIndex], ...updates }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch poem feed
      .addCase(fetchPoemFeed.pending, (state, action) => {
        state.loading = true
        state.error = null
        
        if (action.meta.arg.reset) {
          state.poems = []
          state.offset = 0
          state.hasMore = true
        }
      })
      .addCase(fetchPoemFeed.fulfilled, (state, action) => {
        const { poems, hasMore } = action.payload
        
        state.offset += poems.length
        state.poems.push(...poems)
        
        state.hasMore = hasMore
        state.loading = false
        state.isInitialLoading = false
        state.error = null
      })
      .addCase(fetchPoemFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unknown error occurred'
        state.isInitialLoading = false
      })
  }
})

// Export actions
export const { 
  resetFeed, 
  updatePoem, 
} = poemFeedSlice.actions

// Selectors
export const selectPoemFeed = (state: { poemFeed: PoemFeedState }) => state.poemFeed
export const selectPoems = (state: { poemFeed: PoemFeedState }) => state.poemFeed.poems
export const selectPoemFeedLoading = (state: { poemFeed: PoemFeedState }) => state.poemFeed.loading
export const selectPoemFeedError = (state: { poemFeed: PoemFeedState }) => state.poemFeed.error
export const selectOffset = (state: { poemFeed: PoemFeedState }) => state.poemFeed.offset
export const selectHasMore = (state: { poemFeed: PoemFeedState }) => state.poemFeed.hasMore
export const selectIsInitialLoading = (state: { poemFeed: PoemFeedState }) => state.poemFeed.isInitialLoading

export default poemFeedSlice.reducer