import React from 'react'
import SignUpForm from './sign-up-form'

const SignUp = () => {
  return (
    <div className='h-screen bg-cover flex justify-center items-center' style={{ backgroundImage: 'url(/images/sign-up-bg.jpg)' }}>
      <div className='w-1/3 flex-col items-center p-8 bg-[#fff] rounded-lg border border-[#d9d9d9]'>
        <p className='text-4xl text-center font-bold mb-8'>VIPOE</p>
        <p className='text-md text-start font-semibold mb-2'>Create account for Vipoe</p>
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUp