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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { signUp } from '@/lib/api/auth'
import { toast, Toaster } from 'sonner'

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(48),
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }).max(16).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores.",
  }),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    }),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
})

type FormValues = z.infer<typeof formSchema>

const SignUpForm = () => {
  const [emailVerification, setEmailVerification] = useState(false)
  const [userCache, setUserCache] = useState({
    full_name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      await signUp(data)
      setUserCache({
        full_name: data.full_name.trim(),
        email: data.email.trim(),
      })
      setEmailVerification(true)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "An error occurred during registration.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
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
                    <Input placeholder="Enter fullname" icon={<ALargeSmall/>} {...field} aria-label="Full name"/>
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
                    <Input placeholder="Enter username" icon={<CircleUser/>} {...field} aria-label="Username"/>
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
                    <Input placeholder="Enter email" icon={<Mail/>} {...field} aria-label="Email"/>
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
            <FormField 
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm password" 
                        icon={<LockKeyhole/>} 
                        {...field} 
                        aria-label="Confirm password" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={'lg'} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Create account
            </Button>
          </form>
        </Form>
        <p className='mt-6 text-center'>
          Do you have an account? 
          <Link href='/sign-in' className='ms-2 font-semibold hover:underline'>Login</Link>
        </p>
      </div>
      }
      <Toaster position='bottom-right' richColors />
    </div>
  )
}

export default SignUpForm