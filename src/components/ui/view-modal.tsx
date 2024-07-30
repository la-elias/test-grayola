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
import { useState, useCallback } from 'react'
import { type Database } from '@/app/types/database'
import { File } from 'lucide-react'
import { getProjectFiles } from '@/actions'
import Link from 'next/link'

interface ModalViewProjectProps {
  project: Database['public']['Tables']['projects']['Row']
}

interface FileItemProps {
  file: {
    id: string
    name: string
    url_file: string | null
  }
}

const FileItem = ({ file }: FileItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
      <div className="flex items-center space-x-2">
        <File className="h-4 w-4" />
        <Link
          href={file.url_file ?? '#'}
          target="_blank"
          className="truncate hover:underline max-w-[200px] lg:max-w-[400px]"
        >
          {file.name}{' '}
        </Link>
      </div>
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

export default function ModalViewProject({
  project
}: ModalViewProjectProps) {
  const [title, setTitle] = useState<string>(project.title)
  const [description, setDescription] = useState<string>(
    project.description
  )
  const [isOpen, setIsOpen] = useState<boolean>(false)
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
          variant="secondary"
          className="rounded-md p-2 hover:bg-muted/50 mt-7"
          onClick={async () => {
            await handleGetFiles()
          }}
        >
          View project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>Ver Proyecto</DialogTitle>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Título</Label>
            <div
              id="title"
              className="bg-muted/50 p-2 rounded-md break-all"
            >
              {title}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <div id="description" className="bg-muted/50 p-2 rounded-md break-all">
              {description}
            </div>
          </div>
          <div className="space-y-2">
            {nFiles > 0
              ? Array.from({ length: nFiles }).map(
                  (_, index) => (
                    <FilePlaceholder key={index} />
                  )
                )
              : existingFiles.map((file) => (
                  <FileItem key={file.id} file={file} />
                ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
