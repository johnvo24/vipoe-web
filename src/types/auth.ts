export interface User {
  id: number
  full_name: string
  username: string
  email: string
  avt_url: string
  bio: string
  phone: string
  location: string
  date_of_birth: string  // hoặc Date nếu bạn parse về Date
  is_verified: boolean
  role: string
  created_at: string
  updated_at: string
  last_login: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}