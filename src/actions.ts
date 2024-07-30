'use server'
// import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { generateUUID } from './lib/utils'
// import { createClientServer } from './lib/supabase/server-function'

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
  return data.avatar_url ?? 'https://github.com/shadcn.png'
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
    const fileName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_')

    const { data: link, error: errorStorage } =
      await storage.upload(
        `public/${userId}/${id}/${fileId}/${fileName}`,
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
          name: fileName,
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


export async function getAllProjects()  {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('projects')
    // .select('*, project_assignments!left(designer_id, users(name, avatar_url))')
    .select('*, project_assignments(designer_id, id, users(name, avatar_url))')

  if (error) {
    console.error('Error getting projects:', error.message)
    throw new Error(
      error?.message || 'Error getting projects'
    )
  }
  return data
}

export async function getAllDesigners(userId: string) {
  const cookieStore = cookies()
  // const supabase = createClientServer(cookieStore)
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'designer')

  if (error) {
    console.error('Error getting designers:', error.message)
    throw new Error(
      error?.message || 'Error getting designers'
    )
  }
  return data
}

export async function assignDesigner(
  projectId: string,
  designerId: string[]
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // retrieve the project_assignments table
  const { data: assignments, error: errorAssignments } =
    await supabase
      .from('project_assignments')
      .select('designer_id')
      .eq('project_id', projectId)
  if (errorAssignments) {
    console.error(
      'Error getting project assignments:',
      errorAssignments.message
    )
    throw new Error(
      errorAssignments?.message ||
        'Error getting project assignments'
    )
  }

  // determine to add or remove a designer from a project
  const designersToAdd = designerId.filter(
    (id) =>
      !assignments.some(
        (assignment) => assignment.designer_id === id
      )
  )
  const designersToRemove = assignments
    .map((assignment) => assignment.designer_id)
    .filter((id) => !designerId.includes(id))

  // add new designers
  for (const id of designersToAdd) {
    const { error: errorAdd } = await supabase
      .from('project_assignments')
      .insert([{ project_id: projectId, designer_id: id }])
    if (errorAdd) {
      console.error('Error adding designer:', errorAdd.message)
      throw new Error(
        errorAdd?.message || 'Error adding designer'
      )
    }
  }

  // remove designers
  for (const id of designersToRemove) {
    const { error: errorRemove } = await supabase
      .from('project_assignments')
      .delete()
      .eq('project_id', projectId)
      .eq('designer_id', id)
    if (errorRemove) {
      console.error('Error removing designer:', errorRemove.message)
      throw new Error(
        errorRemove?.message || 'Error removing designer'
      )
    }
  }
  
  return true
}

export async function deleteProject(projectId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // get the user ID
  const { data: user } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', projectId)
    .single()
  
  const userId = user?.client_id

  // get the files associated with the project
  const { data: files } = await supabase
    .from('files_project')
    .select('id, name')
    .eq('project_id', projectId)
  if (files) {
    // eliminate the files associated with the project
    const storage = supabase.storage.from('projects')
    for (const file of files) {
      const { error: errorStorage } = await storage.remove(
        [`public/${userId}/${projectId}/${file.id}/${file.name}`]
      )
      if (errorStorage) {
        console.error(
          'Error removing file:',
          errorStorage.message
        )
        throw new Error(
          errorStorage?.message || 'Error removing file'
        )
      }
    }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
  if (error) {
    console.error('Error deleting project:', error.message)
    throw new Error(
      error?.message || 'Error deleting project'
    )
  }
  return true
}

export async function getProjectFiles(projectId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('files_project')
    .select('id, name, url_file')
    .eq('project_id', projectId)
  if (error) {
    console.error('Error getting project files:', error.message)
    throw new Error(
      error?.message || 'Error getting project files'
    )
  }
  return data
}

export async function deleteProjectFile(
   fileId: string,
   projectId: string,
   fileName: string
  ) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  console.log('Deleting file:', fileId, projectId, fileName)

  // get the user ID
  const { data: user } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', projectId)
    .single()
  const userId = user?.client_id
  console.log('User ID:', userId)

  const { error } = await supabase
    .from('files_project')
    .delete()
    .eq('id', fileId)
  if (error) {
    console.error('Error deleting project file:', error.message)
    throw new Error(
      error?.message || 'Error deleting project file'
    )
  }

  const storage = supabase.storage.from('projects')
  const { error: errorStorage } = await storage.remove(
    [`public/${userId}/${projectId}/${fileId}/${fileName}`]
  )
  if (errorStorage) {
    console.error(
      'Error removing file:',
      errorStorage.message
    )
    throw new Error(
      errorStorage?.message || 'Error removing file'
    )
  }
  return true
}

export async function editProject(
  formData: FormData
) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const projectId = formData.get('projectId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const userId = formData.get('userId') as string
  const files = formData.getAll('file') as File[]

  console.log(userId, files)
  const { error } = await supabase
    .from('projects')
    .update({ title, description })
    .eq('id', projectId)
  if (error) {
    console.error('Error updating project:', error.message)
    throw new Error(
      error?.message || 'Error updating project'
    )
  }

  // // If the user want to add a file
  // if (files.length > 0) {
  //   const storage = supabase.storage.from('projects')
  //   for (const file of files) {
  //     const fileId = generateUUID()
  //     const { data: link, error: errorStorage } =
  //       await storage.upload(
  //         `public/${userId}/${projectId}/${fileId}`,
  //         file
  //       )
  //     if (errorStorage) {
  //       console.error(
  //         'Error uploading file:',
  //         errorStorage.message
  //       )
  //       throw new Error(
  //         errorStorage?.message || 'Error uploading file'
  //       )
  //     }
  //     const expiresIn = 60 * 60 * 24 * 30 // 30 days
  //     const { data: signedURL, error } =
  //       await storage.createSignedUrl(link.path, expiresIn)

  //     if (error) {
  //       console.error(
  //         'Error creating signed URL:',
  //         error.message
  //       )
  //       throw new Error(
  //         error?.message || 'Error creating signed URL'
  //       )
  //     }

  //     const { error: errorInsert } = await supabase
  //       .from('files_project')
  //       .insert([
  //         {
  //           id: fileId,
  //           project_id: projectId,
  //           name: file.name,
  //           url_file: signedURL.signedUrl
  //         }
  //       ])
  //     if (errorInsert) {
  //       console.error(
  //         'Error inserting file:',
  //         errorInsert.message
  //       )
  //       throw new Error(
  //         errorInsert?.message || 'Error inserting file'
  //       )
  //     }
  //   }
  // }

  return true
}

