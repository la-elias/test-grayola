/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import { ChangeEvent, FormEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  GitHubLogoIcon
} from '@radix-ui/react-icons'
import axios from 'axios'
import { Logo } from '../ui/icons'
import { supabase } from '@/lib/supabase/browser-client'
import { Provider } from '@supabase/supabase-js'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import Link from 'next/link'

export default function LoginForm() {
  const [errorMessage, setErrorMessage] =
    useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPasswordInput, setShowPasswordInput] =
    useState<boolean>(false)

  const router = useRouter()

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value)
    if (e.target.value.length > 0) {
      setShowPasswordInput(true)
    } else {
      setShowPasswordInput(false)
    }
  }

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value)
  }

  // Provider Login
  const handleProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) console.log(error)
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    // Reset error message
    setErrorMessage('')

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const data = await axios.post('/auth/login', formData)
      if (data.status === 200) {
        router.push('/dashboard')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (
          error.response.data.error ===
          'Invalid login credentials'
        ) {
          setErrorMessage('Error: Credenciales invalidas.')
        } else {
          setErrorMessage(error.response.data.error)
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(
          'Error: No se logro conectar con el servidor.'
        )
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
          onClick={() => window.history.back()}
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
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@correo.com"
            className="mt-2"
            required
          />
          {showPasswordInput && (
            <div className="mt-5">
              <div className="flex justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
            className="w-full font-bold px-6 py-4 mt-4 text-sm text-center
              rounded-xl disabled:bg-gray-400 disabled:text-gray-800
              dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
          >
            Ingresar
          </Button>
        </form>

        <div className="flex flex-col justify-evenly mt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={async () =>
              await handleProvider('github')
            }
          >
            <GitHubLogoIcon />
            <p className="pl-4">Ingresa con Github</p>
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          No tienes cuenta?{' '}
          <Link href="/signup" className="underline">
            Registrate
          </Link>
        </div>
      </div>
    </div>
  )
}
