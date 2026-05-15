"use client"
import { createTask, updateTask } from "@/actions/task"
import { getUsers } from "@/actions/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Priorities, Types, TaskType, User, Task } from "@/lib/definitions"
import { useActionState, useEffect, useRef, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { userInitials } from "@/lib/utils"

type ModifyTaskProps = {
    open: boolean
    setOpen: (open: boolean) => void
    task?: Task
    projectId?: string
}

export default function ModifyTask({
    open,
    setOpen,
    task,
    projectId,
}: ModifyTaskProps) {
    const isEditing = !!task
    const formRef = useRef<HTMLFormElement>(null)
    const [users, setUsers] = useState<User[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(true)
    const [selectedType, setSelectedType] = useState<TaskType | undefined>(
        task?.type || undefined
    )
    const [selectedPriority, setSelectedPriority] = useState(
        task?.priority || undefined
    )
    const [selectedUserId, setSelectedUserId] = useState(
        task?.userId || undefined
    )

    const initialState = {
        message: "",
        errors: {},
        status: "idle",
        fields: {
            title: task?.title ?? "",
            description: task?.description ?? "",
            type: task?.type ?? "",
            status: task?.status ?? "",
            priority: task?.priority ?? "",
            userId: task?.userId ?? "",
            projectId: task?.projectId ?? "",
        },
    }

    const action = isEditing ? updateTask : createTask
    const [state, formAction, pending] = useActionState(action, initialState)

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
            if (isEditing) {
                setSelectedType((state.fields?.type as TaskType) || undefined)
                setSelectedPriority(
                    (state.fields?.priority as "low" | "medium" | "high") ||
                        undefined
                )
                setSelectedUserId(state.fields?.userId || undefined)
            } else {
                formRef.current?.reset()
                setSelectedType(undefined)
                setSelectedPriority(undefined)
                setSelectedUserId(undefined)
            }
            setOpen(false)
        }
    }, [state, setOpen, isEditing])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="m-3 rounded-lg data-[side=right]:h-[calc(100svh-1.5rem)]">
                <SheetHeader className="pb-0">
                    <SheetTitle>
                        {isEditing ? "Edit task" : "Create task"}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? "Update the task details and click save when you're done."
                            : "Fill in the details of the new task and click save when you're done."}
                    </SheetDescription>
                </SheetHeader>
                <form
                    ref={formRef}
                    action={formAction}
                    className="h-[75vh] space-y-4 overflow-hidden overflow-y-auto px-4 py-1"
                >
                    {isEditing && (
                        <input name="id" type="hidden" value={task?.id} />
                    )}
                    <input
                        type="hidden"
                        name="projectId"
                        value={task?.projectId ?? projectId}
                    />
                    <input
                        name="status"
                        type="hidden"
                        value={task?.status ?? "todo"}
                    />
                    <input
                        name="userId"
                        type="hidden"
                        value={selectedUserId ?? undefined}
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
                                <input
                                    type="hidden"
                                    name="type"
                                    value={selectedType ?? ""}
                                />
                                <Select
                                    value={selectedType}
                                    onValueChange={(value) => {
                                        if (value !== null)
                                            setSelectedType(value as TaskType)
                                    }}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
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
                                <input
                                    type="hidden"
                                    name="priority"
                                    value={selectedPriority ?? ""}
                                />
                                <Select
                                    value={selectedPriority}
                                    onValueChange={(value) => {
                                        if (value !== null)
                                            setSelectedPriority(
                                                value as
                                                    | "low"
                                                    | "medium"
                                                    | "high"
                                            )
                                    }}
                                >
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority" />
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
                            <FieldLabel htmlFor="user_id">Assignee</FieldLabel>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between bg-transparent font-normal"
                                    >
                                        <SelectedUser
                                            userId={selectedUserId}
                                            users={users}
                                        />
                                        <HugeiconsIcon
                                            icon={ArrowDown01Icon}
                                            size={16}
                                            color="currentColor"
                                            strokeWidth={1.5}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {isLoadingUsers ? (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            Loading...
                                        </div>
                                    ) : users.length === 0 ? (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            No users found
                                        </div>
                                    ) : (
                                        users.map((user) => (
                                            <DropdownMenuCheckboxItem
                                                key={user.id}
                                                checked={
                                                    selectedUserId === user.id
                                                }
                                                onCheckedChange={() =>
                                                    setSelectedUserId(user.id)
                                                }
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="flex h-8 w-8 items-center justify-center">
                                                        <AvatarImage
                                                            src={`/${user.avatar}`}
                                                            alt={user.name}
                                                            className="h-6 w-6 rounded-full object-contain"
                                                        />
                                                        <AvatarFallback>
                                                            {userInitials(
                                                                user.name
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{user.name}</span>
                                                        {user.title && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {user.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </DropdownMenuCheckboxItem>
                                        ))
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <FieldError>
                                {state?.errors?.userId?.join(", ")}
                            </FieldError>
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

function SelectedUser({ userId, users }: { userId?: string; users: User[] }) {
    const user = users.find((user) => user.id === userId)
    if (!user)
        return <span className="text-muted-foreground">Select an assignee</span>

    return (
        <div className="flex items-center gap-2">
            <Avatar className="flex h-6 w-6 items-center justify-center">
                <AvatarImage
                    src={`/${user.avatar}`}
                    alt={user.name}
                    className="h-5 w-5 rounded-full object-contain"
                />
                <AvatarFallback>
                    {user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
        </div>
    )
}
