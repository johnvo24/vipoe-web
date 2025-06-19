"use client"

import { useAppDispatch } from "@/lib/hooks/reduxHooks"
import { setToken } from "@/lib/store/auth/authSlice"
import { fetchUser } from "@/lib/store/auth/authThunks"
import { useEffect } from "react"

export default function AppInit() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("token")
    dispatch(fetchUser(token))
    if (token) dispatch(setToken(token))
  }, [dispatch])
  return null
}