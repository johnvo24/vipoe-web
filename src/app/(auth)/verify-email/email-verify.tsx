"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyEmail } from '@/lib/api/auth'

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
    const emailVerify = async () => {
      try {
        await verifyEmail(token)
        setStatus('success')
        setTimeout(() => {
          router.push('/sign-in')
        }, 2000)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setStatus('error')
      }
    }
    emailVerify()
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