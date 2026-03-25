"use client"
import { createTask } from "@/actions/task"
import { getUsers } from "@/actions/user"
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
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Priorities, Types } from "@/lib/definitions"
import { User } from "@/lib/generated/prisma/client"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"

export function CreateTask({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(true)
    const formRef = useRef<HTMLFormElement>(null)
    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: "",
            description: "",
            type: "",
            status: "",
            priority: "",
            userId: "",
            projectId: "",
        },
    }
    const [state, formAction, pending] = useActionState(
        createTask,
        initialState
    )

    useEffect(() => {
        let active = true
        getUsers()
            .then((result) => {
                if (active) setUsers(result ?? [])
                if (active) setIsLoadingUsers(false)
            })
            .catch(() => {
                if (active) setUsers([])
                if (active) setIsLoadingUsers(false)
            })
        return () => {
            active = false
        }
    }, [])

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
                        <span className="hidden md:flex">New Task</span>
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the new task and click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <form
                        className="space-y-4 py-1"
                        ref={formRef}
                        action={formAction}
                    >
                        <input name="status" type="hidden" value="todo" />
                        <input
                            name="projectId"
                            type="hidden"
                            value={projectId}
                        />
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
                            <div className="flex items-center gap-4">
                                <Field>
                                    <FieldLabel htmlFor="type">Type</FieldLabel>
                                    <Select
                                        id="type"
                                        name="type"
                                        defaultValue={state?.fields?.type}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    Types.find(
                                                        (type) =>
                                                            type.value === value
                                                    )?.label ?? "Select type"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Types.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldError>
                                        {state?.errors?.type?.join(", ")}
                                    </FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="priority">
                                        Priority
                                    </FieldLabel>
                                    <Select
                                        id="priority"
                                        name="priority"
                                        defaultValue={state?.fields?.priority}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                {(value) =>
                                                    Priorities.find(
                                                        (priority) =>
                                                            priority.value ===
                                                            value
                                                    )?.label ??
                                                    "Select priority"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Priorities.map((priority) => (
                                                    <SelectItem
                                                        key={priority.value}
                                                        value={priority.value}
                                                    >
                                                        {priority.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldError>
                                        {state?.errors?.priority?.join(", ")}
                                    </FieldError>
                                </Field>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="user_id">
                                    Assignee
                                </FieldLabel>
                                <Select
                                    id="user_id"
                                    name="userId"
                                    defaultValue={state?.fields?.userId}
                                >
                                    <SelectTrigger id="user_id">
                                        <SelectValue>
                                            {(value) =>
                                                users.find(
                                                    (user) => user.id === value
                                                )?.name ?? "Select assignee"
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem
                                                value="unassigned"
                                                disabled
                                            >
                                                Select a user
                                            </SelectItem>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                            {isLoadingUsers && (
                                                <SelectItem
                                                    disabled
                                                    value="loading-users"
                                                >
                                                    Loading users...
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError>
                                    {state?.errors?.userId?.join(", ")}
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
