"use client"
import { createProject, fetchProjects, updateProject } from "@/actions/project"
import { DatePicker } from "@/components/form/date-picker"
import { SelectUsers } from "@/components/form/select-users"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useActionState, useEffect, useRef, useState } from "react"

type ModifyProjectProps = {
    open: boolean
    setOpen: (open: boolean) => void
    project?: Awaited<ReturnType<typeof fetchProjects>>[number]
}

export default function ModifyProject({
    open,
    setOpen,
    project,
}: ModifyProjectProps) {
    const isEditing = !!project
    const [date, setDate] = useState<Date | undefined>(
        project?.dueDate ?? new Date()
    )
    const [members, setMembers] = useState<string[]>(
        project?.members.map((member) => member.id) ?? []
    )
    const formRef = useRef<HTMLFormElement>(null)

    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: project?.title ?? "",
            description: project?.description ?? "",
            dueDate: project?.dueDate?.toISOString() ?? "",
            members: project?.members.map((member) => member.id) ?? [],
        },
    }

    const action = isEditing ? updateProject : createProject
    const [state, formAction, pending] = useActionState(action, initialState)

    useEffect(() => {
        if (state?.status === "success" && state.message) {
            if (!isEditing) {
                formRef.current?.reset()
                setDate(undefined)
                setMembers([])
            }
            setOpen(false)
        }
    }, [state, isEditing])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="m-3 rounded-lg data-[side=right]:h-[calc(100svh-1.5rem)] data-[side=right]:w-[calc(100vw-1.5rem)] data-[side=right]:lg:w-3/4">
                <SheetHeader className="pb-0">
                    <SheetTitle>
                        {isEditing ? "Edit project" : "Create project"}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? "Update the project details and click save when you're done."
                            : "Fill in the details of the new project and click save when you're done."}
                    </SheetDescription>
                </SheetHeader>
                <form
                    ref={formRef}
                    action={formAction}
                    className="h-[75vh] space-y-4 overflow-hidden overflow-y-auto px-4 py-1"
                >
                    {isEditing && (
                        <input type="hidden" name="id" value={project.id} />
                    )}
                    <FieldGroup className="gap-4">
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={state?.fields?.title}
                            />
                            <FieldError>
                                {state?.errors?.title?.join(", ")}
                            </FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={state?.fields?.description}
                            />
                            <FieldError>
                                {state?.errors?.description?.join(", ")}
                            </FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="dueDate">Due date</FieldLabel>
                            <DatePicker date={date} setDate={setDate} />
                            <input
                                type="hidden"
                                name="dueDate"
                                value={date?.toISOString()}
                            />
                            <FieldError>
                                {state?.errors?.dueDate?.join(", ")}
                            </FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="members">Members</FieldLabel>
                            <SelectUsers
                                users={members}
                                setUsers={setMembers}
                            />
                            <FieldError>
                                {state?.errors?.members?.join(", ")}
                            </FieldError>
                            {members.map((id) => (
                                <input
                                    key={id}
                                    type="hidden"
                                    name="members"
                                    value={id}
                                />
                            ))}
                        </Field>
                    </FieldGroup>
                </form>
                <SheetFooter>
                    <Button
                        type="button"
                        size="lg"
                        disabled={pending}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        {pending ? (
                            <Spinner />
                        ) : isEditing ? (
                            "Update"
                        ) : (
                            "Create"
                        )}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
