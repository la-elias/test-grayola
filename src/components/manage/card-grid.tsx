'use client'
import TaskCard from './card-task'
import { type Database } from '@/app/types/database'

interface TaskGridProps {
  projects: Array<
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
  assignees: Array<
    Database['public']['Tables']['users']['Row']
  >
  userId: string
}

export default function TaskGrid({
  projects,
  assignees,
  userId
}: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project) => (
        <TaskCard
          key={project.id}
          project={project}
          assignees={assignees}
          userId={userId}
        />
      ))}
    </div>
  )
}
