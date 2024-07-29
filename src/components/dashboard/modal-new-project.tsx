'use client'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProject } from '@/actions'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ModalNewProjectProps {
  userId: string
}

export default function ModalNewProject({
  userId
}: ModalNewProjectProps) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false)
  const router = useRouter()

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value)
  }

  const handleFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (files) {
      setFiles(Array.from(files))
    }
  }

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (isSubmitting) return
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      files.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('userId', userId)

      try {
        const response = await createProject(formData)
        if (response) {
          setTitle('')
          setDescription('')
          setFiles([])
          setIsOpen(false)
          router.refresh()
        }
      } catch (error) {
        console.error('Error creating project:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [title, description, files, userId]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Nuevo Proyecto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>Nuevo Proyecto</DialogTitle>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Ingresa el título"
              minLength={7}
              maxLength={50}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Ingresa una descripción"
              value={description}
              onChange={handleDescriptionChange}
              minLength={80}
              maxLength={220}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="file">Archivos</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFilesChange}
              multiple
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
