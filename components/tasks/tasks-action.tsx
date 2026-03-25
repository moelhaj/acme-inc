import { deleteTask } from "@/actions/task"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BoardTask } from "@/lib/definitions"
import {
    Delete02Icon,
    MoreHorizontalCircle01Icon,
    Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Fragment, useState } from "react"
import DeleteModal from "../delete-modal"
import UpdateTask from "./update-task"

export default function TaskActions({
    projectId,
    task,
}: {
    projectId: string
    task: BoardTask
}) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete() {
        setIsLoading(true)
        await deleteTask(task.id, projectId)
        setIsLoading(false)
        setOpenDeleteModal(false)
    }

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger
                    nativeButton={true}
                    render={
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
                    }
                />
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
                        nativeButton={true}
                        variant="destructive"
                        onClick={() => setOpenDeleteModal(true)}
                        render={
                            <button
                                type="button"
                                className="flex w-full items-center gap-2"
                            >
                                <HugeiconsIcon
                                    icon={Delete02Icon}
                                    size={20}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                />
                                Delete
                            </button>
                        }
                    ></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                onConfirm={handleDelete}
                title="Are you absolutely sure?"
                isLoading={isLoading}
            />
            <UpdateTask
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                task={task}
            />
        </Fragment>
    )
}
