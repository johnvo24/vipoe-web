"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/services"
import { jwtDecode } from "jwt-decode"
import { API_ROUTES } from "../routes"

interface User {
  id: number
  full_name: string
  username: string
  email: string
  phone: string
  location: string
  bio: string
  date_of_birth: string
  avt_url: string
}

const useAuth = () => {
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decode: any = jwtDecode(token)
        api.get(API_ROUTES.GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token")
          setUser(null)
        })
        .finally(() => setLoading(false))
      } catch (error) {
        localStorage.removeItem("token")
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])
  
  return { user, loading }
}

export default useAuth