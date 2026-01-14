"use client";
import { updateProject, State } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Project } from "@/lib/definitions";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button size="sm" type="submit" className="w-full" disabled={pending}>
			{pending ? <Spinner /> : "Update Project"}
		</Button>
	);
}

export default function UpdateProjectForm({
	project,
	onCancel,
	onSuccess,
}: {
	project: Project;
	onCancel?: () => void;
	onSuccess?: () => void;
}) {
	const router = useRouter();
	const initialState: State = { message: null, errors: {}, success: false };
	const updateProjectWithId = updateProject.bind(null, project.id);
	const [state, formAction] = useActionState(updateProjectWithId, initialState);

	useEffect(() => {
		if (state.success) {
			if (onSuccess) {
				onSuccess();
				return;
			}
			router.replace("/projects");
		}
	}, [onSuccess, router, state.success]);

	return (
		<Form action={formAction} className="flex flex-col h-full justify-around gap-6">
			<div className="space-y-2">
				<Label htmlFor="title" className="block font-medium">
					Title
				</Label>
				<Input id="title" name="title" defaultValue={project.title} />
				{state.errors?.title &&
					state.errors.title.map((error: string) => (
						<p className="text-rose-500" key={error}>
							{error}
						</p>
					))}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description" className="block font-medium">
					Description
				</Label>
				<Textarea id="description" name="description" defaultValue={project.description} />
				{state.errors?.description &&
					state.errors.description.map((error: string) => (
						<p className="text-rose-500" key={error}>
							{error}
						</p>
					))}
			</div>
			<div className="space-y-2">
				<Label htmlFor="status" className="block font-medium">
					Status
				</Label>
				<Select name="status" defaultValue={project.status}>
					<SelectTrigger>
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="todo">To Do</SelectItem>
							<SelectItem value="in_progress">In Progress</SelectItem>
							<SelectItem value="in_review">In Review</SelectItem>
							<SelectItem value="done">Done</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				{state.errors?.status &&
					state.errors.status.map((error: string) => (
						<p className="text-rose-500" key={error}>
							{error}
						</p>
					))}
			</div>
			<div className="space-y-2">
				<Label htmlFor="priority" className="block font-medium">
					Priority
				</Label>
				<Select name="priority" defaultValue={project.priority}>
					<SelectTrigger>
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="low">Low</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="high">High</SelectItem>
							<SelectItem value="urgent">Urgent</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				{state.errors?.priority &&
					state.errors.priority.map((error: string) => (
						<p className="text-rose-500" key={error}>
							{error}
						</p>
					))}
			</div>
			<div className="flex flex-col gap-2">
				<SubmitButton />
				{onCancel ? (
					<Button size="sm" variant="outline" type="button" onClick={onCancel}>
						Cancel
					</Button>
				) : (
					<Button asChild size="sm" variant="outline">
						<Link href="/projects">Cancel</Link>
					</Button>
				)}
			</div>
		</Form>
	);
}
