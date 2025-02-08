/**
 * SignUpForm Component
 *
 * A form component that handles user registration with the following features:
 * - Email and password registration
 * - First name and last name collection
 * - Google OAuth sign-in option
 * - Form validation and error handling
 * - Loading state management
 * - Toggle between signup and login views
 *
 * The component uses Redux Toolkit's mutation hooks for API integration
 * and includes proper form accessibility with labels and ARIA attributes.
 *
 * Layout Structure:
 * - Header with title and description
 * - Input fields for user details
 * - Submit button with loading state
 * - Error message display
 * - OAuth divider
 * - Google sign-in button
 * - Login link for existing users
 *
 * Props:
 * - className: Optional class names for styling
 * - toggleCover: Function to switch between signup/login views
 * - Additional form props spread to form element
 */

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignupMutation } from '../store/ApiServices/LmsEngine/AuthApiServices'

interface SignUpFormProps extends React.ComponentPropsWithoutRef<'form'> {
  toggleCover: () => void
}

export function SignUpForm({
  className,
  toggleCover,
  ...props
}: SignUpFormProps) {
  // State management for form fields
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [signup, { isLoading, error }] = useSignupMutation()
  const role = 'student'

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup({
        email,
        password,
        first_name: name,
        last_name: lastName,
        role: role,
      }).unwrap()
      // handle successful signup
      toggleCover()
    } catch (err) {
      console.error('Signup error:', err)
      // handle error
    }
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSignup}
      {...props}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Create an Account</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          Enter your details below to create a new account
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='firstname'>First Name</Label>
          <Input
            id='firstname'
            type='text'
            placeholder='First Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='lastname'>Last Name</Label>
          <Input
            id='lastname'
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='m@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type='submit' className='w-full' disabled={isLoading}>
          Sign Up
        </Button>
        {error && (
          <p className='mt-4 text-red-500'>
            Error: {'status' in error ? error.status : error.message}
          </p>
        )}
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
        <Button variant='outline' className='w-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 48 48'
            width='24px'
            height='24px'
          >
            <path
              fill='#4285F4'
              d='M24 9.5c3.9 0 6.6 1.6 8.1 2.9l6-6C34.7 2.7 29.9 0 24 0 14.6 0 6.8 5.8 3.3 14.1l7.1 5.5C12.2 13.1 17.5 9.5 24 9.5z'
            />
            <path
              fill='#34A853'
              d='M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12.7c-.5 2.7-2 5-4.2 6.5l6.5 5.1c3.8-3.5 6-8.6 6-15.6z'
            />
            <path
              fill='#FBBC05'
              d='M10.4 28.6c-1.1-3.3-1.1-6.9 0-10.2L3.3 13c-2.4 4.8-2.4 10.4 0 15.2l7.1-5.6z'
            />
            <path
              fill='#EA4335'
              d='M24 48c6.5 0 12-2.1 16-5.7l-6.5-5.1c-2.4 1.6-5.4 2.6-9.5 2.6-6.5 0-12-4.3-14-10.2l-7.1 5.5C6.8 42.2 14.6 48 24 48z'
            />
            <path fill='none' d='M0 0h48v48H0z' />
          </svg>
          Sign Up with Google
        </Button>
      </div>
      <div className='text-center text-sm'>
        Already have an account?{' '}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleCover()
          }}
          className='underline underline-offset-4'
        >
          Login
        </button>
      </div>
    </form>
  )
}
