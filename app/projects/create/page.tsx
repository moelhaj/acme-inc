"use client";
import { createProject, State } from "@/actions/project";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button size="sm" type="submit" className="w-full" disabled={pending}>
			{pending ? <Spinner /> : "Create Project"}
		</Button>
	);
}

export default function CreateProject() {
	const pathname = usePathname();
	const router = useRouter();
	const initialState: State = { message: null, errors: {} };
	const [state, formAction] = useActionState(createProject, initialState);
	const [open, setOpen] = useState(true);

	useEffect(() => {
		if (pathname === "/projects/create") {
			setTimeout(() => setOpen(true), 0);
		} else {
			setTimeout(() => setOpen(false), 0);
		}
	}, [pathname]);

	return (
		<Sheet
			open={open}
			onOpenChange={isOpen => {
				setOpen(isOpen);
				if (!isOpen) {
					router.back();
				}
			}}
		>
			<SheetContent
				side="right"
				onPointerDownOutside={e => e.preventDefault()}
				className="gap-0"
			>
				<SheetHeader className="pb-0">
					<SheetTitle>Create new project</SheetTitle>
					<SheetDescription>
						Fill in the details below to create a new project.
					</SheetDescription>
				</SheetHeader>
				<Form action={formAction} className="flex flex-col h-full justify-around px-4">
					<div className="space-y-2">
						<Label htmlFor="title" className="block font-medium">
							Title
						</Label>
						<Input id="title" name="title" />
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
						<Textarea id="description" name="description" />
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
						<Select name="status">
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
						<Select name="priority">
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
						<Button asChild size="sm" variant="outline" onClick={() => router.back()}>
							<span className="w-full text-center">Cancel</span>
						</Button>
					</div>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
