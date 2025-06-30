import { User } from "@/types/auth"
import { API_ROUTES } from "../routes"
import { api } from "../services"

export async function signIn(username: string, password: string) {
  const formData = new URLSearchParams()
  formData.append("username", username)
  formData.append("password", password)

  const response = await api.post(API_ROUTES.SIGN_IN, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
  return response.data
}

export const getProfile = async (token: string): Promise<User> => {
  const res = await api.get(API_ROUTES.GET_PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProfile(token: string, data: any): Promise<void> {
  await api.put(API_ROUTES.UPDATE_PROFILE, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateAvatar(token: string, formData: any): Promise<object> {
  const res = await api.put(API_ROUTES.UPDATE_AVATAR, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signUp(data: any) {
  await api.post(API_ROUTES.SIGN_UP, data)
}

export async function verifyEmail(token: string) {
  await api.post(`${API_ROUTES.VERIFY_EMAIL}/${token}`)
}