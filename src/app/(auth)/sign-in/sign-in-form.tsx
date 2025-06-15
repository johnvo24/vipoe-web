"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { UserCircle2, LockKeyhole } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/services'

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(16),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).max(100),
})

type FormValues = z.infer<typeof formSchema>

const SignInForm = () => {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const formData = new URLSearchParams()
      formData.append("username", values.username)
      formData.append("password", values.password)

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
      localStorage.setItem("token", response.data.access_token)
      router.push('/')
    } catch (error) {
      alert("Username or Password wrong")
    }
  }

  if (!isMounted) return <div>Loading...</div>

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField 
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter username" icon={<UserCircle2/>} {...field}/>
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
          <Button type="submit" className="w-full" size={'lg'}>Login</Button>
        </form>
      </Form>
      <p className='mt-6 text-center'>
        Don't have an account? 
        <Link href='/sign-up' className='ms-2 font-semibold hover:underline'>Create account</Link>
      </p>
    </div>
  )
}

export default SignInForm