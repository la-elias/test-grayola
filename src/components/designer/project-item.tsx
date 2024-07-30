import {
  Card,
  CardContent,
  CardHeader
} from '@/components/ui/card'
import { Draggable } from 'react-beautiful-dnd'
import { type Database } from '@/app/types/database'
import { PaperclipIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectItemProps {
  project:
    | Database['public']['Tables']['projects']['Row']
    | null
  index: number
}

const ProjectItem = ({
  project,
  index
}: ProjectItemProps) => {
  if (!project) {
    return null
  }
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="cursor-grab">
            <CardHeader>
              <h3 className="text-lg font-medium break-words">
                {project.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="break-all">
                {project.description}
              </p>
              <div className="mt-7 flex items-center gap-2">
                <Button variant="default" size="sm">
                  View Order
                </Button>
              </div>
              <div className="mt-7 flex items-center gap-2">
                <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground break-words">
                  {project.n_files} files uploaded
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

export default ProjectItem
