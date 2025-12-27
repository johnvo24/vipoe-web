"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { UserCircle2, LockKeyhole, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/api/auth'
import { useAppDispatch } from '@/lib/hooks/reduxHooks'
import { fetchUser } from '@/lib/store/auth/authThunks'
import { setToken } from '@/lib/store/auth/authSlice'
import { resetFeed } from '@/lib/store/poem/poemFeedSlice'
import { resetCollection } from '@/lib/store/collection/collectionSlice'
import { toast, Toaster } from 'sonner' // Assuming shadcn/ui toast

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }).max(16),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).max(100),
})

type FormValues = z.infer<typeof formSchema>

const SignInForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "",},
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const data = await signIn(values.username, values.password)
      localStorage.setItem("token", data.access_token)
      await dispatch(fetchUser(data.access_token))
      dispatch(setToken(data.access_token))
      dispatch(resetFeed())
      dispatch(resetCollection())
      router.push('/')
    } catch (error) {
      toast.error("Invalid username or password.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return <div>Loading...</div>

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField 
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter username" icon={<UserCircle2/>} {...field} aria-label="Username" />
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
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter password" 
                      icon={<LockKeyhole/>} 
                      {...field} 
                      aria-label="Password" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size={'lg'} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            Login
          </Button>
        </form>
      </Form>
      <p className='mt-6 text-center'>
        Don&#39;t have an account? 
        <Link href='/sign-up' className='ms-2 font-semibold hover:underline'>Create account</Link>
      </p>
      <Toaster position='bottom-right' richColors/>
    </div>
  )
}

export default SignInForm