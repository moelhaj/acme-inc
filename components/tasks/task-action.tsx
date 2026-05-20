"use client"
import { deleteTask, getTasks } from "@/actions/task"
import DeleteModal from "@/components/delete-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Delete02Icon,
  MoreHorizontalCircle01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Fragment, useState } from "react"
import { BoardTask, Task } from "@/lib/definitions"
import TaskForm from "./task-form"

export function TaskAction({ task }: { task: BoardTask }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      await deleteTask(task.id, task.projectId)
    } catch (error) {
      throw new Error("Failed to delete task.")
    } finally {
      setIsLoading(false)
      setOpenDeleteModal(false)
    }
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 data-[state=open]:bg-muted"
          >
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.5}
            />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setOpenUpdateModal(true)}>
            <HugeiconsIcon
              icon={Settings01Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.5}
            />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteModal(true)}
          >
            <button type="submit" className="flex w-full items-center gap-2">
              <HugeiconsIcon
                icon={Delete02Icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
              Delete
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        onConfirm={handleDelete}
        title="Delete project?"
        isLoading={isLoading}
      />
      <TaskForm
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        task={task}
        projectId={task.projectId}
      />
    </Fragment>
  )
}
