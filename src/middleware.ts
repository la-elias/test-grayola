import { createClient } from './lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    const redirectToDashboard =
      (pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/') &&
      user
    const redirectToLogin =
      (pathname.startsWith('/dashboard') ||
        pathname === '/admin') &&
      !user

    if (redirectToLogin) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }

    // User loged and try to access login page
    if (redirectToDashboard) {
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      )
    }

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|auth).*)'
}
