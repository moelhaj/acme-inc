"use client"
import { createProject } from "@/actions/project"
import { Button } from "@/components/ui/button"
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
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useRef, useState } from "react"

export default function CreateProject() {
    const [open, setOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: "",
            description: "",
        },
    }
    const [state, formAction, pending] = useActionState(
        createProject,
        initialState
    )

    useEffect(() => {
        if (state?.status === "success" && state.message) {
            formRef.current?.reset()
            setTimeout(() => setOpen(false), 0)
        }
    }, [state, setOpen])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button>
                        <HugeiconsIcon
                            icon={Add01Icon}
                            size={20}
                            color="currentColor"
                        />
                        <span className="hidden md:flex">New Project</span>
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the new project and click save
                        when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <form
                        className="space-y-4 py-1"
                        ref={formRef}
                        action={formAction}
                    >
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
                        {pending ? <Spinner /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
