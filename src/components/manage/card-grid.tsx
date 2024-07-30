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
}

export default function TaskGrid({
  projects,
  assignees,
}: TaskGridProps) {
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA; // Descending order
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {sortedProjects.map((project) => (
        <TaskCard
          key={project.id}
          project={project}
          assignees={assignees}
        />
      ))}
    </div>
  )
}
