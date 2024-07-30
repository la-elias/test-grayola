"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function DragDropComponent() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finish wireframes", status: "To Do" },
    { id: 2, title: "Implement login functionality", status: "To Do" },
    { id: 3, title: "Design homepage", status: "In Progress" },
    { id: 4, title: "Write unit tests", status: "In Progress" },
    { id: 5, title: "Deploy to production", status: "Done" },
  ])
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const { source, destination } = result
    const newTasks = Array.from(tasks)
    const [removed] = newTasks.splice(source.index, 1)
    removed.status = destination.droppableId
    newTasks.splice(destination.index, 0, removed)
    setTasks(newTasks)
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col gap-6 mt-8 px-4 sm:px-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {["To Do", "In Progress", "Done"].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="flex flex-col gap-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">{status}</h2>
                    <Badge variant="outline">
                      {tasks.filter((task) => task.status === status).length}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card className="cursor-grab">
                                <CardContent>{task.title}</CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}