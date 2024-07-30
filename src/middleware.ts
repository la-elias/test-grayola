import { createClient } from './lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    if (!user) {
      // User is not logged in and trying to access protected routes
      if (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/manage') ||
        pathname.startsWith('/designer')
      ) {
        return NextResponse.redirect(
          new URL('/login', request.url)
        )
      }
      return response
    }

    const { data: userRole, error } = await supabase.rpc(
      'get_user_role',
      {
        userid: user.id
      }
    )

    if (error) {
      console.error('Error getting user role', error)
      return NextResponse.error()
    }
    // Redirect logged-in users from login and signup pages

    if (pathname === '/login' || pathname === '/register') {
      switch (userRole) {
        case 'project_manager':
          return NextResponse.redirect(
            new URL('/manage', request.url)
          )
        case 'designer':
          return NextResponse.redirect(
            new URL('/designer', request.url)
          )
        case 'client':
          return NextResponse.redirect(
            new URL('/dashboard', request.url)
          )
        default:
          return NextResponse.error()
      }
    }

    // Other pages
    switch (userRole) {
      case 'project_manager':
        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/manage')
        ) {
          return response
        }
        return NextResponse.redirect(
          new URL('/manage', request.url)
        )

      case 'client':
        if (pathname.startsWith('/dashboard')) {
          return response
        }
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        )
      case 'designer':
        if (pathname.startsWith('/designer')) {
          return response
        }
        return NextResponse.redirect(
          new URL('/designer', request.url)
        )
      default:
        return NextResponse.error()
    }
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|auth).*)'
}
