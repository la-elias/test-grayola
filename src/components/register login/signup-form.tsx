'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  GitHubLogoIcon
} from '@radix-ui/react-icons'
import axios from 'axios'
import { supabase } from '@/lib/supabase/browser-client'
import { Provider } from '@supabase/supabase-js'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Logo } from '../ui/icons'
import Link from 'next/link'
// import { getUser, updateUserProfile } from '@/actions'

export default function RegisterForm() {
  const [errorMessage, setErrorMessage] =
    useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPasswordInput, setShowPasswordInput] =
    useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const router = useRouter()

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(e.target.value)
  }

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value)
    if (e.target.value.length > 0) {
      setShowPasswordInput(true)
    } else {
      setShowPasswordInput(false)
    }
  }

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value)
  }

  const handleRegistrationWithProvider = async (
    provider: Provider
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) console.log(error)
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    // Reset error message
    setErrorMessage('')
    if (password.length < 7) {
      setErrorMessage(
        'La contraseña debe tener al menos 7 caracteres.'
      )
      return
    }
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('name', name)
    try {
      const response = await axios.post(
        '/auth/signup',
        formData
      )
      if (response.status === 200) {
        router.push('/dashboard')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          'Registration failed:',
          error.response.data.error
        )
        setErrorMessage(error.response.data.error)
      }
    }
  }

  return (
    <div
      className={cn(
        `flex flex-col justify-between px-14 pt-8 pb-8 mx-auto w-full
          max-w-4xl min-h-screen`,
        'text-black',
        'dark:text-white'
      )}
    >
      <div className="absolute top-5 left-5">
        <button
          onClick={() => {
            router.back()
            router.refresh()
          }}
          className="flex items-center justify-center p-2 rounded-full
            hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="sr-only">Back</span>{' '}
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center mt-24">
          <Logo className="h-auto w-56" />
        </div>

        <form onSubmit={handleSubmit} className="mt-7">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Nombre"
            className="mt-2"
            required
          />
          <div className="mt-5">
            <Label htmlFor="email">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@correo.com"
              className="mt-2"
              required
            />
          </div>
          {showPasswordInput && (
            <div className="mt-5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="********"
                className="mt-2"
                required
              />
            </div>
          )}
          {errorMessage && (
            <div
              className="flex items-center p-4 mt-2 text-sm text-red-800 border
                border-red-300 rounded-lg bg-red-50 dark:bg-gray-800
                dark:text-red-400 dark:border-red-800"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              !email || (showPasswordInput && !password)
            }
            className="w-full font-bold px-6 py-4 mt-8 text-sm text-center
              rounded-xl disabled:bg-gray-400 disabled:text-gray-800
              dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
          >
            Registrar
          </Button>
        </form>

        <div className="flex flex-col justify-evenly mt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={async () =>
              await handleRegistrationWithProvider('github')
            }
          >
            <GitHubLogoIcon />
            <p className="pl-4">Ingresa con Github</p>
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          Ya tienes una cuenta?{' '}
          <Link href="/login" className="underline">
            Ingresa!
          </Link>
        </div>
      </div>
    </div>
  )
}
