'use client'

import { useState } from 'react'
import {
  DragDropContext,
  DropResult
} from 'react-beautiful-dnd'
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

  const initialColumns = {
    pending: {
      id: 'pending',
      list: dProjects.filter(
        (project) => project.projects?.state === 'pending'
      )
    },
    'in progress': {
      id: 'in progress',
      list: dProjects.filter(
        (project) =>
          project.projects?.state === 'in progress'
      )
    },
    done: {
      id: 'done',
      list: dProjects.filter(
        (project) => project.projects?.state === 'done'
      )
    },
    cancel: {
      id: 'cancel',
      list: dProjects.filter(
        (project) => project.projects?.state === 'cancel'
      )
    }
  }

  const [columns, setColumns] = useState(initialColumns)
  const router = useRouter()

  const handleDragEnd = async ({
    source,
    destination
  }: DropResult) => {
    if (destination === undefined || destination === null) {
      return null
    }

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null
    }

    const start =
      columns[source.droppableId as keyof typeof columns]
    const end =
      columns[
        destination.droppableId as keyof typeof columns
      ]

    const currentColumns = JSON.parse(JSON.stringify(columns))

    if (start === end) {
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      )

      newList.splice(
        destination.index,
        0,
        start.list[source.index]
      )

      const newCol = {
        id: start.id,
        list: newList
      }

      setColumns((state) => ({
        ...state,
        [newCol.id]: newCol
      }))
    } else {
      const newStartList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      )

      const newStartCol = {
        id: start.id,
        list: newStartList
      }

      const newEndList = [...end.list]

      newEndList.splice(
        destination.index,
        0,
        start.list[source.index]
      )

      const newEndCol = {
        id: end.id,
        list: newEndList
      }

      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }))

      const movedProject = start.list[source.index].projects
      if (movedProject) {
        try {
          await updateProjectState(
            movedProject.id,
            destination.droppableId as Database['public']['Enums']['state']
          )
        } catch (error) {
          console.error(
            'Failed to update project state',
            error
          )
          setColumns(currentColumns)
        } finally {
          router.refresh()
        }
      }
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
          {Object.values(columns).map((col) => (
            <ProjectColumn col={col} key={col.id} />
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}

export default ProjectBoard
