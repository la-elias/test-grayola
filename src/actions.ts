'use server'
// import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { generateUUID } from './lib/utils'

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
  if (!id) {
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

export async function avatarUrl(
  userId: string
): Promise<string> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('users')
    .select('avatar_url')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Error getting avatar:', error.message)
    throw new Error(
      error?.message || 'Error getting avatar'
    )
  }
  return data.avatar_url
}

export async function createProject(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const id = generateUUID()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const userId = formData.get('userId') as string
  const files = formData.getAll('file') as File[]

  const { error } = await supabase
    .from('projects')
    .insert([{ id, title, description, client_id: userId }])
  if (error) {
    console.error('Error creating project:', error.message)
    throw new Error(
      error?.message || 'Error creating project'
    )
  }

  const storage = supabase.storage.from('projects')
  for (const file of files) {
    const fileId = generateUUID()
    const { data: link, error: errorStorage } =
      await storage.upload(
        `public/${userId}/${id}/${fileId}`,
        file
      )
    if (errorStorage) {
      console.error(
        'Error uploading file:',
        errorStorage.message
      )
      throw new Error(
        errorStorage?.message || 'Error uploading file'
      )
    }
    const expiresIn = 60 * 60 * 24 * 30 // 30 days
    const { data: signedURL, error } =
      await storage.createSignedUrl(link.path, expiresIn)

    if (error) {
      console.error(
        'Error creating signed URL:',
        error.message
      )
      throw new Error(
        error?.message || 'Error creating signed URL'
      )
    }

    const { error: errorInsert } = await supabase
      .from('files_project')
      .insert([
        {
          id: fileId,
          project_id: id,
          name: file.name,
          url_file: signedURL.signedUrl
        }
      ])
    if (errorInsert) {
      console.error(
        'Error inserting file:',
        errorInsert.message
      )
      throw new Error(
        errorInsert?.message || 'Error inserting file'
      )
    }
  }
  return true
}

export async function getProjects(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', userId)
  if (error) {
    console.error('Error getting projects:', error.message)
    throw new Error(
      error?.message || 'Error getting projects'
    )
  }
  return data
}