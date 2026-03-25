"use client"
import { updateProject } from "@/actions/project"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Project } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { useActionState, useEffect, useRef } from "react"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    project: Project
}

export function UpdateProject({ open, setOpen, project }: Props) {
    const formRef = useRef<HTMLFormElement>(null)
    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: project.title,
            description: project.description,
        },
    }
    const [state, formAction, pending] = useActionState(
        updateProject,
        initialState
    )

    useEffect(() => {
        if (state?.status === "success" && state.message) {
            setOpen(false)
        }
    }, [state, setOpen])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update project</DialogTitle>
                    <DialogDescription>
                        Update the title and description of your project.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <form
                        className="space-y-4 py-1"
                        ref={formRef}
                        action={formAction}
                    >
                        <input type="hidden" name="id" value={project.id} />
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
                        </FieldGroup>
                    </form>
                </div>
                <DialogFooter>
                    <DialogClose
                        render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button
                        type="button"
                        disabled={pending}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        {pending ? <Spinner /> : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
