export interface Poem {
  id: number
  genre_id: number
  user_id: number
  prompt: string
  title: string
  image_url: string
  content: string
  note: string
  is_public: boolean
  created_at: string
  updated_at: string
  user_name: string
  full_name: string
  avt_url: string
  genre_name: string
  tags: string[]
}