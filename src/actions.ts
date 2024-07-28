'use server'
// import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
// import { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getUser() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting session:', error.message)
    throw new Error(
      error?.message || 'Error getting session'
    )
  }
  if (!user) {
    return null
  }
  return user
}

export async function updateUserProfile(
  id: string,
  name: string
) {
    if (!id){
        throw new Error('User ID is required')
    }
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const response = await supabase
    .from('users')
    .update({ name })
    .eq('id', id)
  return response
}
