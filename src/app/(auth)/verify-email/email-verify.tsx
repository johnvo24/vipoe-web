"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/services'
import { API_ROUTES } from '@/lib/routes'

const EmailVerify = () => {
  const router = useRouter()
  const tokenParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const token = tokenParams.get('token')
    if (!token) {
      setStatus('error')
      return
    }

    const verifyEmail = async () => {
      try {
        await api.post(`${API_ROUTES.VERIFY_EMAIL}/${ token }`)
        setStatus('success')
        setTimeout(() => {
          router.push('/sign-in')
        }, 2000)
      } catch (error) {
        setStatus('error')
      }
    }

    verifyEmail()
  }, [tokenParams, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      {status === 'verifying' && <p>Đang xác thực email của bạn...</p>}
      {status === 'success' && <p className="text-green-600">Xác thực thành công! Đang chuyển đến trang đăng nhập...</p>}
      {status === 'error' && <p className="text-red-600">Xác thực thất bại hoặc token không hợp lệ.</p>}
    </div>
  )
}

export default EmailVerify