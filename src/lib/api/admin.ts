import { User } from "@/types/auth"
import { API_ROUTES } from "../routes"
import { api } from "../services"

export const getUsers = async (token?: string): Promise<User[]> => {
  const res = await api.get(API_ROUTES.GET_USERS, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const getUserById = async (userId: number, token?: string): Promise<User> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined
  const res = await api.get(`${API_ROUTES.GET_USER}${userId}`, {
    headers,
  })
  return res.data
}

export const createUser = async (userData: { full_name: string; username: string; email: string; password: string }, token?: string): Promise<User> => {
  const res = await api.post(API_ROUTES.CREATE_NEW_USER, userData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const updateUser = async (userId: number, userData: Partial<User>, token?: string): Promise<User> => {
  const res = await api.put(`${API_ROUTES.UPDATE_USER}${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const deleteUser = async (userId: number, token?: string): Promise<void> => {
  await api.delete(`${API_ROUTES.DELETE_USER}${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const changeUserPassword = async (
  formData: { old_password: string; new_password: string },
  token?: string
): Promise<void> => {
  await api.put(`${API_ROUTES.CHANGE_PASSWORD}/change-password`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getSummary = async (token?: string): Promise<[]> => {
  const res = await api.get(`${API_ROUTES.GET_SUMMARY}stats/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}