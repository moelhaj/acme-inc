"use client"
import { createTask, updateTask } from "@/actions/task"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { BoardTask, Project, User } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { SelectUsers } from "../form/select-users"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(20, {
    message: "Title must be at most 20 characters.",
  }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(50, {
      message: "Description must be at most 50 characters.",
    }),
  userId: z.string().uuid({ message: "Assignee is required" }),
  priority: z.enum(["low", "medium", "high"], {
    error: "Priority is required",
  }),
  type: z.enum(["feature", "bug", "improvement"], {
    error: "Type is required",
  }),
})

type TaskFormProps = {
  task?: BoardTask
  projectId: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function TaskForm({
  task,
  projectId,
  open,
  setOpen,
}: TaskFormProps) {
  const router = useRouter()
  const isEditing = !!task

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      userId: task?.userId ?? "",
      priority: task?.priority ?? "medium",
      type: task?.type ?? "feature",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        userId: task?.userId ?? "",
        priority: task?.priority ?? "medium",
        type: task?.type ?? "feature",
      })
    }
  }, [open])

  const isLoading = form.formState.isSubmitting || form.formState.isLoading
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  async function onSubmit(data: z.infer<typeof formSchema>) {
    isEditing
      ? await updateTask({ ...data, id: task?.id, projectId })
      : await createTask(projectId, data)
    router.refresh()
    toast.success(`Task ${isEditing ? "updated" : "created"} successfully!`)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your task and save them."
              : "Fill out the form below to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <form
            id="task-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pb-1"
          >
            {isEditing && <input type="hidden" name="id" value={task.id} />}
            <FieldGroup className="gap-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-title">Title</FieldLabel>
                    <Input {...field} id="form-title" autoComplete="off" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-description">
                      Description
                    </FieldLabel>
                    <Textarea {...field} id="form-description" rows={4} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-type">Type</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="improvement">
                            Improvement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-priority">Priority</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="userId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-assignee">Assignee</FieldLabel>
                    <SelectUsers
                      multiple={false}
                      selectedUsers={field.value || ""}
                      setSelectedUsers={(value) => {
                        field.onChange(value)
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            form="task-form"
            type="submit"
            disabled={isLoading || !isValid || (isEditing ? !isDirty : false)}
          >
            {isLoading ? <Spinner /> : isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
