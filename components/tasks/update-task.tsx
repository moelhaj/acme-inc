"use client"
import { updateTask } from "@/actions/task"
import { getUsers } from "@/actions/user"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { Task, User } from "@/lib/generated/prisma/client"
import { useActionState, useEffect, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"

type UpdateProjectProps = {
    open: boolean
    setOpen: (open: boolean) => void
    task: Task
}

export default function UpdateTask({
    open,
    setOpen,
    task,
}: UpdateProjectProps) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(true)
    const [selectedType, setSelectedType] = useState(task.type || "")
    const [selectedPriority, setSelectedPriority] = useState(
        task.priority || ""
    )
    const [selectedUserId, setSelectedUserId] = useState(task.userId || "")
    const formRef = useRef<HTMLFormElement>(null)
    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: task.title || "",
            description: task.description || "",
            type: task.type || "",
            status: task.status || "",
            priority: task.priority || "",
            userId: task.userId || "",
            projectId: task.projectId || "",
        },
    }
    const [state, formAction, pending] = useActionState(
        updateTask,
        initialState
    )

    useEffect(() => {
        if (!open) return

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
    }, [open])

    useEffect(() => {
        if (state?.status === "success" && state.message) {
            formRef.current?.reset()
            setTimeout(() => setOpen(false), 0)
        }
    }, [state, setOpen])

    useEffect(() => {
        setSelectedType(task.type || "")
        setSelectedPriority(task.priority || "")
        setSelectedUserId(task.userId || "")
    }, [task.id, task.type, task.priority, task.userId])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update task</DialogTitle>
                    <DialogDescription>
                        Update the title and description of your task.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <form
                        className="space-y-4 py-1"
                        ref={formRef}
                        action={formAction}
                    >
                        <input
                            name="projectId"
                            type="hidden"
                            value={task.projectId}
                        />
                        <input name="id" type="hidden" value={task.id} />
                        <input
                            name="status"
                            type="hidden"
                            value={task.status}
                        />
                        <FieldGroup>
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
                                        value={selectedType}
                                        onValueChange={(value) => {
                                            if (value !== null)
                                                setSelectedType(value)
                                        }}
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
                                        value={selectedPriority}
                                        onValueChange={(value) => {
                                            if (value !== null)
                                                setSelectedPriority(value)
                                        }}
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
                                    value={selectedUserId}
                                    onValueChange={(value) => {
                                        if (value !== null)
                                            setSelectedUserId(value)
                                    }}
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
                        {pending ? <Spinner /> : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        // <Sheet open={open} onOpenChange={setOpen}>
        //     <SheetContent>
        //         <SheetHeader className="pb-0">
        //             <SheetTitle>Update issue</SheetTitle>
        //             <SheetDescription>
        //                 Make changes to the issue details and save your updates.
        //             </SheetDescription>
        //         </SheetHeader>

        //         <SheetFooter>
        //             <Button type="submit" form="update-issue">
        //                 {isSubmitting ? <Spinner /> : "Update"}
        //             </Button>
        //             <SheetClose asChild>
        //                 <Button type="button" variant="outline">
        //                     Close
        //                 </Button>
        //             </SheetClose>
        //         </SheetFooter>
        //     </SheetContent>
        // </Sheet>
    )
}
