import { Badge } from '@/components/ui/badge'
import { Droppable } from 'react-beautiful-dnd'
import ProjectItem from './project-item'
import { type Database } from '@/app/types/database'

interface ProjectColumnProps {
  state: string
  projects: Array<{
    project_id: string
    assigned_at: string
    projects:
      | Database['public']['Tables']['projects']['Row']
      | null
  }>
}

const ProjectColumn = ({
  state,
  projects
}: ProjectColumnProps) => (
  <Droppable droppableId={state}>
    {(provided) => (
      <div
        className="flex flex-col gap-4"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{state}</h2>
          <Badge variant="outline">
            {
              projects.filter(
                (project) =>
                  project.projects?.state === state
              ).length
            }
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {projects
            .filter(
              (project) => project.projects?.state === state
            )
            .map((project, index) => (
              <ProjectItem
                key={project.project_id}
                project={project.projects}
                index={index}
              />
            ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
)

export default ProjectColumn
