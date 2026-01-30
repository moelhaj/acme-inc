"use client";
import { updateIssue } from "@/actions/issues";
import { fetchUsers } from "@/actions/user";
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
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Issue, Priorities, Statuses, Types, User } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	project_id: z.string(),
	title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be at most 500 characters"),
	type: z.enum(["bug", "feature", "improvement"], {
		message: "Type is required",
	}),
	status: z.enum(["todo", "in_progress", "in_review", "done"], {
		message: "Status is required",
	}),
	statusUpdatedAt: z.string(),
	priority: z.enum(["low", "medium", "high", "urgent"], {
		message: "Priority is required",
	}),
	user_id: z.string().uuid({ message: "Assignee is required" }),
	position: z.number(),
});

type UpdateProjectProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	issue: Issue;
};

export function UpdateIssue({ open, setOpen, issue }: UpdateProjectProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(true);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			project_id: issue?.project_id || "",
			title: issue?.title || "",
			description: issue?.description || "",
			status: issue?.status || "todo",
			statusUpdatedAt: issue?.statusUpdatedAt || new Date().toISOString(),
			priority: issue?.priority || "low",
			type: issue?.type || "bug",
			user_id: issue?.user_id || "",
			position: issue?.position || 0,
		},
	});

	const isSubmitting = form.formState.isSubmitting;

	useEffect(() => {
		let active = true;
		fetchUsers()
			.then(result => {
				if (active) setUsers(result ?? []);
				if (active) setIsLoadingUsers(false);
			})
			.catch(() => {
				if (active) setUsers([]);
				if (active) setIsLoadingUsers(false);
			});
		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		if (!open) return;
		form.reset({
			project_id: issue?.project_id || "",
			title: issue?.title || "",
			description: issue?.description || "",
			status: issue?.status || "todo",
			statusUpdatedAt: issue?.statusUpdatedAt || new Date().toISOString(),
			priority: issue?.priority || "low",
			type: issue?.type || "bug",
			user_id: issue?.user_id || "",
			position: issue?.position || 0,
		});
	}, [form, issue, open]);

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await updateIssue(issue?.id, data);
		form.reset();
		setOpen(false);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent>
				<SheetHeader className="pb-0">
					<SheetTitle>Update issue</SheetTitle>
					<SheetDescription>
						Make changes to the issue details and save your updates.
					</SheetDescription>
				</SheetHeader>
				<form
					id="update-issue"
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
											className="min-h-8 resize-none"
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
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="type"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="title">Type</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger
												id="type"
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{Types.map(type => (
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
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
							<Controller
								name="user_id"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="user_id">Assignee</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger
												id="user_id"
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Assign to user" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="unassigned" disabled>
														Select a user
													</SelectItem>
													{users.map(user => (
														<SelectItem key={user.id} value={user.id}>
															{user.name}
														</SelectItem>
													))}
													{isLoadingUsers && (
														<SelectItem disabled value="loading-users">
															Loading users...
														</SelectItem>
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</FieldGroup>
				</form>
				<SheetFooter>
					<Button type="submit" form="update-issue">
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
