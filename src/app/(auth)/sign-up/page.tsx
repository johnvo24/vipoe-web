import React from 'react'
import Link from 'next/link'
import SignUpForm from './sign-up-form'

const SignUp = () => {
  return (
    <div className='h-screen bg-cover flex justify-center items-center' style={{ backgroundImage: 'url(/images/sign-up-bg.jpg)' }}>
      <div className='w-1/3 flex-col items-center p-8 bg-[#fff] rounded-lg border border-[#d9d9d9]'>
        <p className='text-4xl text-center font-bold mb-8'>VIPOE</p>
        <p className='text-md text-start font-semibold mb-2'>Create account</p>
        <SignUpForm />
        <p className='mt-6 text-center'>
          Do you have an account? 
          <Link href='/login' className='ms-2 font-semibold hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp