import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CollectionState } from '@/types/collection'
import { fetchCollection } from './collectionThunks'

const initialState: CollectionState = {
  poems: [],
  loading: true,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 10,
  isInitialLoading: true
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    resetCollection: (state) => {
      state.poems = []
      state.offset = 0
      state.hasMore = true
      state.error = null
      state.loading = false
      state.isInitialLoading = true
    },
    removePoemFromCollection: (state, action: PayloadAction<number>) => {
      const poemId = action.payload
      state.poems = state.poems.filter(poem => Number(poem.id) !== Number(poemId))
      state.offset = Math.max(0, state.offset - 1)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollection.pending, (state, action) => {
        state.loading = true
        state.error = null
        if (action.meta.arg.reset) {
          state.poems = []
          state.offset = 0
          state.hasMore = true
        }
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        const { poems, hasMore } = action.payload

        const existingIds = new Set(state.poems.map(poem => poem.id))
        const newPoems = poems.filter(poem => !existingIds.has(poem.id))

        state.offset += newPoems.length
        state.poems.push(...newPoems)
        state.hasMore = hasMore
        state.loading = false
        state.isInitialLoading = false
        state.error = null
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unknown error occurred'
        state.isInitialLoading = false
      })
  }
})

export const { resetCollection, removePoemFromCollection } = collectionSlice.actions

export const selectCollection = (state: { collection: CollectionState }) => state.collection
export const selectCollectionPoems = (state: { collection: CollectionState }) => state.collection.poems
export const selectCollectionLoading = (state: { collection: CollectionState }) => state.collection.loading
export const selectCollectionError = (state: { collection: CollectionState }) => state.collection.error
export const selectCollectionOffset = (state: { collection: CollectionState }) => state.collection.offset
export const selectCollectionHasMore = (state: { collection: CollectionState }) => state.collection.hasMore
export const selectCollectionIsInitialLoading = (state: { collection: CollectionState }) => state.collection.isInitialLoading

export default collectionSlice.reducer