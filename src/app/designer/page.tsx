import { HeaderDashboard } from '@/components/dashboard/header-dashboard'
import {
  getUser,
  avatarUrl,
  getDesignerProjects
} from '@/actions'
import { type Database } from '../types/database'
import ProjectBoard from '@/components/designer/project-board'

export default async function DesignPage() {
  const user = await getUser()
  let avatar = ''
  let projects = [] as Array<{
    project_id: string
    assigned_at: string
    projects:
      | Database['public']['Tables']['projects']['Row']
      | null
  }>

  if (user) {
    avatar = await avatarUrl(user.id)
    projects = await getDesignerProjects(user.id)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderDashboard avatarUrl={avatar} />
      <ProjectBoard dProjects={projects} />
    </div>
  )
}
