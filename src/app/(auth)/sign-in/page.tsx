import React from 'react'
import SignInForm from './sign-in-form'

const SignIn = () => {
  return (
    <div className='h-screen bg-backgroundAuth bg-cover flex justify-center items-center' style={{ backgroundImage: 'url(/images/sign-up-bg.jpg)' }}>
      <div className='flex-col items-center p-8 bg-[#fff] rounded-lg border border-[#d9d9d9]'>
        <p className='text-4xl text-center font-bold mb-8'>VIPOE</p>
        <p className='text-md text-start font-semibold mb-2'>Sign in Vipoe</p>
        <SignInForm />
      </div>
    </div>
  )
}

export default SignIn