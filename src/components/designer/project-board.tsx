'use client'

import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import ProjectColumn from './project-colum'
import { updateProjectState } from '@/actions'
import { type Database } from '@/app/types/database'
import { useRouter } from 'next/navigation'

interface ProjectBoardProps {
  dProjects: Array<{
    project_id: string
    assigned_at: string
    projects:
      | Database['public']['Tables']['projects']['Row']
      | null
  }>
}

const ProjectBoard = ({ dProjects }: ProjectBoardProps) => {

  const [projects, setProjects] = useState<
    Array<{
      project_id: string
      assigned_at: string
      projects:
        | Database['public']['Tables']['projects']['Row']
        | null
    }>
  >(dProjects)
  const router = useRouter()

  const handleDragEnd = async (result: {
    destination: any
    source?: any
  }) => {
    if (!result.destination) return

    const { source, destination } = result
    const newProjects = Array.from(projects)
    const [movedProject] = newProjects.splice(
      source.index,
      1
    )

    if (!movedProject.projects) {
      console.error('Project data is missing')
      return
    }

    movedProject.projects.state = destination.droppableId
    newProjects.splice(destination.index, 0, movedProject)
    setProjects(newProjects)

    try {
      await updateProjectState(
        movedProject.project_id,
        movedProject.projects.state
      )
    } catch (error) {
      console.error('Failed to update project state', error)
      // Optionally, revert the state change if the API call fails
    } finally {
      router.refresh()
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Designer Project Board
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {['pending', 'in progress', 'done', 'cancel'].map(
            (state) => (
              <ProjectColumn
                key={state}
                state={state}
                projects={projects}
              />
            )
          )}
        </div>
      </div>
    </DragDropContext>
  )
}

export default ProjectBoard
