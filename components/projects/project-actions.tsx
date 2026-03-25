"use client"
import { deleteProject } from "@/actions/project"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Project } from "@/lib/generated/prisma/client"
import {
    Delete02Icon,
    MoreHorizontalCircle01Icon,
    Settings01Icon,
    ProfileIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Fragment, useState } from "react"
import DeleteModal from "../delete-modal"
import { UpdateProject } from "./update-project"
import Link from "next/link"

export function ProjectAction({ project }: { project: Project }) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleDelete() {
        setIsLoading(true)
        await deleteProject(project.id)
        setIsLoading(false)
        setOpenDeleteModal(false)
    }

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger
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
                    <DropdownMenuItem
                        render={
                            <Link
                                href={`/projects/${project.id}`}
                                className="flex items-center gap-2"
                            >
                                <HugeiconsIcon
                                    icon={ProfileIcon}
                                    size={20}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                />
                                View
                            </Link>
                        }
                    />
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
            <UpdateProject
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                project={project}
            />
        </Fragment>
    )
}
