"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyEmail } from '@/lib/api/auth'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const EmailVerifyContent: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      return
    }

    const emailVerify = async (): Promise<void> => {
      try {
        await verifyEmail(token)
        setStatus('success')
        setTimeout(() => {
          router.push('/sign-in')
        }, 2000)
      } catch (error) {
        console.error('Email verification failed:', error)
        setStatus('error')
      }
    }

    emailVerify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Đang xác thực email</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Xác thực thành công!</h2>
            <p className="text-gray-600">
              Email của bạn đã được xác thực thành công. 
              Đang chuyển đến trang đăng nhập...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Xác thực thất bại</h2>
            <p className="text-gray-600">
              Liên kết xác thực không hợp lệ hoặc đã hết hạn. 
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <button
              onClick={() => router.push('/sign-up')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng ký lại
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const EmailVerify: React.FC = () => {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Đang tải...</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    }>
      <EmailVerifyContent />
    </React.Suspense>
  )
}

export default EmailVerify