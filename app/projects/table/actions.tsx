"use client";
import { deleteProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import useApp from "@/hooks/use-app";
import { MoreHorizontal, Pin, PinOff, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";

export function DeleteProject({ id }: { id: string }) {
	const { unpinProject, isProjectPinned } = useApp();

	function handleDelete() {
		if (isProjectPinned(id)) {
			unpinProject(id);
		}
		deleteProject(id);
	}

	return (
		<form action={handleDelete}>
			<DropdownMenuItem asChild variant="destructive">
				<button type="submit" className="flex w-full items-center gap-2">
					<Trash2 />
					Delete
				</button>
			</DropdownMenuItem>
		</form>
	);
}

export function Actions({ id, title }: { id: string; title: string }) {
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const { pinnedProjects, pinProject, unpinProject, isProjectPinned } = useApp();
	const [inputValue, setInputValue] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const pinned = isProjectPinned(id);

	function handlePinToggle() {
		if (pinned) {
			unpinProject(id);
			return;
		}
		pinProject({
			id,
			title,
			url: `/projects/${id}`,
			order: pinnedProjects.length + 1,
		});
	}

	async function handleSubmit() {
		setIsLoading(true);
		unpinProject(id);
		await deleteProject(id);
		setIsLoading(false);
		setOpenDeleteModal(false);
	}

	return (
		<Fragment>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="data-[state=open]:bg-muted size-8"
					>
						<MoreHorizontal />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem onClick={handlePinToggle}>
						{pinned ? <PinOff /> : <Pin />}
						{pinned ? "Unpin" : "Pin"}
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/projects/update/${id}`}>
							<Settings2 />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						asChild
						variant="destructive"
						onClick={() => setOpenDeleteModal(true)}
					>
						<button type="submit" className="flex w-full items-center gap-2">
							<Trash2 />
							Delete
						</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
				<DialogContent className="max-w-sm">
					<div className="flex flex-col items-center gap-2">
						<DialogHeader>
							<DialogTitle className="sm:text-center">Final confirmation</DialogTitle>
							<DialogDescription className="sm:text-center mt-4">
								This action cannot be undone. To confirm, please enter the project
								name
							</DialogDescription>
						</DialogHeader>
					</div>

					<div className="space-y-5">
						<input type="hidden" name="projectId" value={id} />
						<div className="*:not-first:mt-2">
							<Label htmlFor={id}>{`Type "${title}" to confirm`}</Label>
							<Input
								id={id}
								type="text"
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary" className="flex-1">
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="button"
								className="flex-1"
								variant="destructive"
								disabled={inputValue !== title || isLoading}
								onClick={handleSubmit}
							>
								{isLoading ? <Spinner className="mr-2" /> : "Delete"}
							</Button>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
}
