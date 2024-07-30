import { HeaderDashboard } from '@/components/dashboard/header-dashboard'
import {
  getUser,
  avatarUrl,
  getAllProjects,
  getAllDesigners
} from '@/actions'
import { type Database } from '../types/database'
import TaskGrid from '@/components/manage/card-grid'

export default async function ManagePage() {
  const user = await getUser()
  let avatar = 'https://github.com/shadcn.png'
  let projects = [] as Array<
    Database['public']['Tables']['projects']['Row'] & {
      project_assignments: Array<{
        designer_id: string
        id: string
        users: {
          name: string | null
          avatar_url: string | null
        } | null
      }>
    }
  >
  let designers = [] as Array<
    Database['public']['Tables']['users']['Row']
  >

  if (user) {
    avatar = await avatarUrl(user.id)
    projects = await getAllProjects()
    designers = await getAllDesigners(user.id)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderDashboard avatarUrl={avatar} />
      <div className="flex items-center justify-between mt-8 px-4 sm:px-20">
        <h2 className="text-2xl font-bold">
          Projects Manager
        </h2>
      </div>
      <div className="flex items-center justify-between mt-8 px-4 sm:px-20">
        {user?.id && (
          <TaskGrid
            projects={projects}
            assignees={designers}
            userId={user.id}
          />
        )}
      </div>
    </div>
  )
}
