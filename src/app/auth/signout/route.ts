import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const data = await supabase.auth.signOut()

  if (data.error?.message) {
    return new NextResponse(
      JSON.stringify({ error: data.error.message }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
  return new NextResponse(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
