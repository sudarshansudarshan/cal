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
import { useInitailizeCourseProgressMutation } from '@/store/apiService'
import axios from 'axios'
import { toast } from 'sonner'

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
  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const signupResponse = await signup({
        email,
        password,
        first_name: name,
        last_name: lastName,
        role: 'student',
      }).unwrap()

      console.log("ia m response",signupResponse)

      // Assuming the Firebase UID is returned in signupResponse under the key 'firebase_uid'
      const firebaseId = signupResponse.firebase_uid

      // Prepare data for the POST request
      const postData = {
        courseInstanceId: '5f36d4ba-b97f-4f7d-b882-181721a05594',
        studentIds: [firebaseId],
        modules: [
          {
            moduleId: '84df0e01-6f61-488b-a4cf-b0d0cfbd90e1',
            sequence: 1,
            sections: [
              {
                sectionId: '080558c2-0e55-44e3-9367-c11bd0bfa19e',
                sequence: 1,
                sectionItems: [
                  {
                    sectionItemId: '4cb3015b-36d9-45c5-bf5f-bb98d9df5270',
                    sequence: 1,
                  },
                  {
                    sectionItemId: 'e6eb1b57-68d3-4b5c-a4ca-0054f611be9d',
                    sequence: 2,
                  },
                  {
                    sectionItemId: 'f1546a38-1768-4775-b10a-7d49c16d28b6',
                    sequence: 3,
                  },
                  {
                    sectionItemId: '8255a101-3913-4b7c-b03c-16c2f7554fa8',
                    sequence: 4,
                  },
                ],
              },
              {
                sectionId: '31d5ead2-4c2e-4705-b828-6a883ccf9689',
                sequence: 2,
                sectionItems: [
                  {
                    sectionItemId: '36fcb3ac-2bd4-4a1b-ae94-a7e26ae4a76d',
                    sequence: 1,
                  },
                  {
                    sectionItemId: 'e7239f6c-d691-453b-b62e-b9b67ca8e54d',
                    sequence: 2,
                  },
                  {
                    sectionItemId: '1a1c4ec1-a555-4af2-a425-cedf3c979a6d',
                    sequence: 3,
                  },
                  {
                    sectionItemId: '0e35a884-79c5-4ea6-b6b8-3bfaf5a93585',
                    sequence: 4,
                  },
                ],
              },
            ],
          },
        ],
      }

      // Perform the Axios POST request
      await axios.post(
        'http://localhost:3001/course-progress/initialize-progress',
        postData
      )
      toast('Signup and data submission successful!', { type: 'success' })
    } catch (err) {
      console.error('Signup or Axios POST error:', err)
      toast('Failed to complete the registration process.', { type: 'error' })
    }
    toggleCover() // Toggle view regardless of the outcome
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
