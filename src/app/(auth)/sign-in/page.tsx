import React from 'react'
import SignInForm from './sign-in-form'
import Link from 'next/link'
import { CircleArrowLeft } from 'lucide-react'

const SignIn = () => {
  return (
    <div className='h-screen bg-backgroundAuth bg-cover flex justify-center items-center' style={{ backgroundImage: 'url(/images/sign-up-bg.jpg)' }}>
      <div className='flex-col items-center bg-[#fff] rounded-lg border border-[#d9d9d9]'>
        <Link href="/" className='flex items-center w-min rounded-full p-1 mt-2 ms-2 cursor-pointer opacity-75 hover:bg-gray-200 hover:opacity-100 transition-all'>
          <CircleArrowLeft className='me-2' />
          Back
        </Link>
        <div className='px-8 py-6'>
          <p className='text-4xl text-center font-bold mb-8'>VIPOE</p>
          <p className='text-md text-start font-semibold mb-2'>Sign in Vipoe</p>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}

export default SignIn