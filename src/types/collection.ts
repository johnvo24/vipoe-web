import { Poem } from "./poem"

export interface CollectionState {
  poems: Poem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  offset: number
  limit: number
  isInitialLoading: boolean
}