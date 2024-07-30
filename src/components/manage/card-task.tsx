'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardContent
} from '@/components/ui/card'
import {
  PaperclipIcon,
  Trash2Icon
} from 'lucide-react'
import { type Database } from '@/app/types/database'
import {
  assignDesigner,
  deleteProject
} from '@/actions'
import { useRouter } from 'next/navigation'
import ModalEditProject from './modal-edit-project'

interface TaskCardProps {
  project: Database['public']['Tables']['projects']['Row'] & {
    project_assignments: Array<{
      designer_id: string
      id: string
      users: {
        name: string | null
        avatar_url: string | null
      } | null
    }>
  }

  assignees: Array<
    Database['public']['Tables']['users']['Row']
  >
}

export default function TaskCard({
  project,
  assignees
}: TaskCardProps) {
  const [selectedAssignees, setSelectedAssignees] =
    useState(
      project.project_assignments.map(
        (assignment) => assignment.designer_id
      )
    ) || []

  const [menuOpen, setMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const router = useRouter()

  function handleAssigneeToggle(assigneeId: string) {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    )
  }

  async function handleDeleteProject() {
    setIsDeleting(true)
    try {
      // Your delete logic here
      await deleteProject(project.id)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSaveAssignees() {
    setIsSaving(true)
    try {
      await assignDesigner(project.id, selectedAssignees)
      router.refresh()
    } finally {
      setIsSaving(false)
      setMenuOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium break-words">
            {project.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                project.state === 'pending'
                  ? 'secondary'
                  : project.state === 'done'
                    ? 'default'
                    : project.state === 'cancel'
                      ? 'destructive'
                      : 'outline'
              }
            >
              {project.state}
            </Badge>
            <ModalEditProject project={project} />
            <Button
              size="icon"
              variant="ghost"
              className="rounded-md bg-muted p-2 hover:bg-muted/50"
              onClick={async (e) => {
                e.preventDefault()
                await handleDeleteProject()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                '...'
              ) : (
                <Trash2Icon className="h-4 w-4" />
              )}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="break-all">{project.description}</p>
        <div className="mt-7 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <div className="flex -space-x-2">
                  {project.project_assignments &&
                  project.project_assignments.length > 0 ? (
                    project.project_assignments.map(
                      (assignment, index) => (
                        <Avatar
                          key={index}
                          className="border-2 border-white"
                        >
                          <AvatarImage
                            src={
                              assignment.users
                                ?.avatar_url ?? undefined
                            }
                          />
                          <AvatarFallback>
                            {assignment.users?.name
                              ?.slice(0, 2)
                              .toUpperCase() ?? 'NA'}
                          </AvatarFallback>
                        </Avatar>
                      )
                    )
                  ) : (
                    <Avatar className="border-2 border-white">
                      <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>
                  Select Assignees
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {assignees.map((assignee) => (
                  <DropdownMenuItem
                    key={assignee.id}
                    className="flex items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Input
                      type="checkbox"
                      checked={selectedAssignees.includes(
                        assignee.id
                      )}
                      onChange={() =>
                        handleAssigneeToggle(assignee.id)
                      }
                      className="mr-2 w-2 h-2"
                    />
                    <span>{assignee.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isSaving}
                  onClick={async (e) => {
                    e.preventDefault()
                    await handleSaveAssignees()
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <p className="text-sm font-medium break-words">
                {project.project_assignments?.length > 0
                  ? project.project_assignments
                      .map(
                        (assignment) =>
                          assignment.users?.name
                      )
                      .filter((name) => name !== null)
                      .join(', ')
                  : 'Unassigned'}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                Created:{' '}
                {
                  new Date(project.created_at)
                    .toISOString()
                    .split('T')[0]
                }
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
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
  )
}
