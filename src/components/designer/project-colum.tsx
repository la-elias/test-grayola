import { Badge } from '@/components/ui/badge'
import { Droppable } from 'react-beautiful-dnd'
import ProjectItem from './project-item'
import { type Database } from '@/app/types/database'

interface ProjectColumnProps {
  col: {
    id: string
    list: Array<{
      project_id: string
      assigned_at: string
      projects:
        | Database['public']['Tables']['projects']['Row']
        | null
    }>
  }
}

const ProjectColumn = ({ col }: ProjectColumnProps) => {
  return (
    <Droppable droppableId={col.id}>
      {(provided) => (
        <div
          className="flex flex-col gap-4"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {col.id}
            </h2>
            <Badge variant="outline">
              {col.list.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2 bg-muted/50 border rounded-lg grow p-4">
            {col.list.map((projectWrapper, index) => (
              <ProjectItem
                key={projectWrapper.project_id}
                project={projectWrapper.projects}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default ProjectColumn
