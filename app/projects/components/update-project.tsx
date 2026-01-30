"use client";
import { updateProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Priorities, Project, Statuses } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	title: z.string().min(1, "Title is required").max(50, "Title must be at most 100 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(100, "Description must be at most 500 characters"),
	status: z.enum(["todo", "in_progress", "in_review", "done"], {
		message: "Status is required",
	}),
	priority: z.enum(["low", "medium", "high", "urgent"], {
		message: "Priority is required",
	}),
});

type UpdateProjectProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	project: Project;
};

export function UpdateProject({ open, setOpen, project }: UpdateProjectProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: project.title,
			description: project.description,
			status: project.status,
			priority: project.priority,
		},
	});

	useEffect(() => {
		if (!open) {
			return;
		}
		form.reset({
			title: project.title,
			description: project.description,
			status: project.status,
			priority: project.priority,
		});
	}, [form, open, project]);

	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await updateProject(project.id, data);
		form.reset();
		setOpen(false);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent>
				<SheetHeader className="pb-0">
					<SheetTitle>Update project</SheetTitle>
					<SheetDescription>Update the details of your project here.</SheetDescription>
				</SheetHeader>
				<form
					id="update-project"
					className="px-4 h-[75vh] overflow-hidden overflow-y-auto"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="title">Title</FieldLabel>
									<Input
										{...field}
										id="title"
										aria-invalid={fieldState.invalid}
										autoComplete="off"
									/>
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
									<FieldLabel htmlFor="description">Description</FieldLabel>
									<InputGroup>
										<InputGroupTextarea
											{...field}
											id="description"
											rows={4}
											className="min-h-16 resize-none"
											aria-invalid={fieldState.invalid}
										/>
										<InputGroupAddon align="block-end">
											<InputGroupText className="tabular-nums">
												{field.value.length}/100 characters
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="status"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="title">Status</FieldLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger
											id="status"
											aria-invalid={fieldState.invalid}
										>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Statuses.map(status => (
													<SelectItem
														key={status.value}
														value={status.value}
													>
														{status.label}
													</SelectItem>
												))}
											</SelectGroup>
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
									<FieldLabel htmlFor="priority">Priority</FieldLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger
											id="priority"
											aria-invalid={fieldState.invalid}
										>
											<SelectValue placeholder="Select priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Priorities.map(priority => (
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
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<SheetFooter>
					<Button type="submit" form="update-project">
						{isSubmitting ? <Spinner /> : "Update"}
					</Button>
					<SheetClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
