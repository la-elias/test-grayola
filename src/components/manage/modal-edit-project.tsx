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
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { type Database } from '@/app/types/database'
import { FilePenIcon, File, Trash2Icon } from 'lucide-react'
import {
  editProject,
  getProjectFiles,
  deleteProjectFile
} from '@/actions'
import Link from 'next/link'

interface ModalEditProjectProps {
  project: Database['public']['Tables']['projects']['Row']
}

interface FileItemProps {
  file: {
    id: string
    name: string
    url_file: string | null
  }
  projectId: string
  onDelete: (
    fileId: string,
    projectId: string,
    fileName: string
  ) => Promise<void>
}

const FileItem = ({
  file,
  projectId,
  onDelete
}: FileItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    await onDelete(file.id, projectId, file.name)
    setIsDeleting(false)
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
      <div className="flex items-center space-x-2">
        <File className="h-4 w-4" />
        <Link
          href={file.url_file ?? '#'}
          target="_blank"
          className="truncate hover:underline max-w-[200px]"
        >
          {file.name}{' '}
        </Link>
      </div>
      <Button
        variant="ghost"
        className="rounded-md p-2 hover:bg-muted/100"
        onClick={handleDelete}
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
  )
}

const FilePlaceholder = () => (
  <div
    className="flex items-center justify-between p-2 bg-muted/50 rounded-md
      animate-pulse"
  >
    <div className="flex items-center space-x-2">
      <div className="h-4 w-4 bg-muted/70 rounded"></div>
      <div className="h-4 w-24 bg-muted/70 rounded"></div>
    </div>
    <div className="h-4 w-4 bg-muted/70 rounded"></div>
  </div>
)

export default function ModalEditProject({
  project
}: ModalEditProjectProps) {
  const [title, setTitle] = useState<string>(project.title)
  const [description, setDescription] = useState<string>(
    project.description
  )
  const [files, setFiles] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false)
  const [existingFiles, setExistingFiles] = useState<
    Array<{
      id: string
      name: string
      url_file: string | null
    }>
  >([])
  const [nFiles, setNFiles] = useState<number>(
    project.n_files
  )
  const router = useRouter()

  const handleGetFiles = useCallback(async () => {
    try {
      const files = await getProjectFiles(project.id)
      setExistingFiles(files)
    } catch (error) {
      console.error(error)
    } finally {
      setNFiles(0) // Remove placeholders once files are fetched
    }
  }, [project.id])

  const handleDeleteFile = async (
    fileId: string,
    projectId: string,
    fileName: string
  ) => {
    try {
      await deleteProjectFile(fileId, projectId, fileName)
      setExistingFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      )
    } catch (error) {
      console.error(error)
    } finally {
      setNFiles((prevNFiles) => prevNFiles - 1)
      router.refresh()
    }
  }

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

      const date = new Date().toISOString()
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      files.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('projectId', project.id)
      formData.append('updated_at', date)

      try {
        const response = await editProject(formData)
        if (response) {
          setTitle('')
          setDescription('')
          setFiles([])
          setIsOpen(false)
        }
      } catch (error) {
        console.error('Error creating project:', error)
      } finally {
        setIsSubmitting(false)
        router.refresh()
      }
    },
    [
      title,
      description,
      files,
      isSubmitting,
      project.id,
      router
    ]
  )
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (open) {
        setTitle(project.title)
        setDescription(project.description)
        setNFiles(project.n_files)
      }
    },
    [project.title, project.description, project.n_files]
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-md bg-muted p-2 hover:bg-muted/50"
          onClick={async () => {
            await handleGetFiles()
          }}
        >
          <FilePenIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>Editar Proyecto</DialogTitle>
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
          <div className="space-y-2">
            {nFiles > 0
              ? Array.from({ length: nFiles }).map(
                  (_, index) => (
                    <FilePlaceholder key={index} />
                  )
                )
              : existingFiles.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    projectId={project.id}
                    onDelete={handleDeleteFile}
                  />
                ))}
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
              {isSubmitting ? 'Savin...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
