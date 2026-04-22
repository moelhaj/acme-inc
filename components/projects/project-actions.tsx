"use client"
import { deleteProject, fetchProjects } from "@/actions/project"
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
import ModifyProject from "./modify-project"

export function ProjectAction({
    project,
}: {
    project: Awaited<ReturnType<typeof fetchProjects>>[number]
}) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openUpdateSheet, setOpenUpdateSheet] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleDelete() {
        setIsLoading(true)
        try {
            await deleteProject(project.id)
        } catch (error) {
            throw new Error("Failed to delete project.")
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
                    <DropdownMenuItem onClick={() => setOpenUpdateSheet(true)}>
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
                        <button
                            type="submit"
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
            <ModifyProject
                open={openUpdateSheet}
                setOpen={setOpenUpdateSheet}
                project={project}
            />
        </Fragment>
    )
}
