"use client"
import { createProject, updateProject } from "@/actions/project"
import { DatePicker } from "@/components/form/date-picker"
import { SelectUsers } from "@/components/form/select-users"
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
import { Project, User } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
  dueDate: z.date(),
  members: z.array(z.string()).optional(),
})

type ProjectFormProps = {
  project?: Project & { members: User[] }
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ProjectForm({
  project,
  open,
  setOpen,
}: ProjectFormProps) {
  const isEditing = !!project

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      dueDate: project ? new Date(project.dueDate) : undefined,
      members: project?.members.map((member) => member.id) ?? [],
    },
  })

  useEffect(() => {
    form.reset({
      title: project?.title ?? "",
      description: project?.description ?? "",
      dueDate: project ? new Date(project.dueDate) : undefined,
      members: project?.members.map((member) => member.id) ?? [],
    })
  }, [project])

  const isLoading = form.formState.isSubmitting || form.formState.isLoading
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  async function onSubmit(data: z.infer<typeof formSchema>) {
    isEditing
      ? await updateProject(project!.id, data)
      : await createProject(data)
    toast.success(`Project ${isEditing ? "updated" : "created"} successfully!`)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your project and save them."
              : "Fill out the form below to create a new project."}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <form
            id="project-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            {isEditing && <input type="hidden" name="id" value={project.id} />}
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
              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-dueDate">Due date</FieldLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="members"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-members">Members</FieldLabel>
                    <SelectUsers
                      selectedUsers={field.value ?? []}
                      setSelectedUsers={(value) => {
                        const currentMembers = field.value ?? []
                        const nextMembers =
                          typeof value === "function"
                            ? value(currentMembers)
                            : value
                        field.onChange(nextMembers)
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
            form="project-form"
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
