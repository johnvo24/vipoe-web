"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CircleUser } from 'lucide-react'
import { Mail } from 'lucide-react'
import { LockKeyhole } from 'lucide-react'
import { ALargeSmall } from 'lucide-react'
import { AxiosError } from 'axios'
import { api } from '@/lib/services'

const formSchema = z.object({
  full_name: z.string().max(100),
  username: z.string().min(2, {
    message: "Username must be at least 8 characters.",
  }).max(16),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).max(100),
})

type FormValues = z.infer<typeof formSchema>

const SignUpForm = () => {
  const [emailVerification, setEmailVerification] = useState(false)
  const [userCache, setUserCache] = useState({
    full_name: "",
    email: "",
  })
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      await api.post(`/v1/auth/register`, data)
      setUserCache({
        full_name: data.full_name,
        email: data.email,
      })
      setEmailVerification(true)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.detail || "Registration failed")
      }
    }
  }

  return (
    <div>
      {emailVerification ? (
        <div className="bg-amber-200 rounded-lg py-4 px-6">
          <p className="text-sm font-normal">
            Welcome <span className='font-bold'>{userCache.full_name}</span>, your account has been successfully registered. 
            We have sent you an active email at email <span className='font-bold'>{userCache.email}</span>. Please check your inbox to complete.
          </p>
        </div>
      ) : 
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField 
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter fullname" icon={<ALargeSmall/>} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter username" icon={<CircleUser/>} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email" icon={<Mail/>} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" icon={<LockKeyhole/>} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={'lg'} className="w-full cursor-pointer">Create account</Button>
          </form>
        </Form>
        <p className='mt-6 text-center'>
          Do you have an account? 
          <Link href='/sign-in' className='ms-2 font-semibold hover:underline'>Login</Link>
        </p>
      </div>
      }
    </div>
  )
}

export default SignUpForm