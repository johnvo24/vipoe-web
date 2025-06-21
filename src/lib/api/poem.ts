import { API_ROUTES } from "../routes"
import { api } from "../services"
import { Poem } from "@/types/poem"

export async function getUserPoems(token: string): Promise<Poem[]> {
  const res = await api.get(API_ROUTES.CRUD_POEM, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function createPoem(token: string, poemData: FormData): Promise<Poem> {
  const res = await api.post(API_ROUTES.CRUD_POEM, poemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export async function updatePoem(token: string, poemId: number, poemData: FormData): Promise<Poem> {
  const res = await api.put(`${API_ROUTES.CRUD_POEM}${poemId}/`, poemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export async function deletePoem(token: string, poemId: number): Promise<void> {
  await api.delete(`${API_ROUTES.CRUD_POEM}${poemId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getPoemFeed(offset: number, limit: number): Promise<Poem[]> {
  const res = await api.get(API_ROUTES.GET_POEM_FEED, {
    params: { offset, limit },
  })
  return res.data
}

export async function getPoemInCollection(token: string): Promise<Poem[]> {
  const res = await api.get(API_ROUTES.CRUD_COLLECTION, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function saveToCollection(poem_id: number, token: string): Promise<Object> {
  console.log(token)
  const res = await api.post(`${API_ROUTES.CRUD_COLLECTION}${poem_id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data.message
}

export async function removeFromCollection(token: string, poemId: number): Promise<void> {
  await api.delete(`${API_ROUTES.CRUD_COLLECTION}${poemId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}