"use client";

import { deleteIssue } from "@/actions/issues";
import { IssueType, Priority, Status } from "@/app/projects/table/table-items";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Issue } from "@/lib/definitions";
import { MoreHorizontal, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";

export type IssueWithUser = Issue & {
	user_name?: string | null;
	user_avatar?: string | null;
};

type Props = {
	issues: IssueWithUser[];
	onEdit: (issue: Issue) => void;
	onDeleted: (id: string) => void;
};

function IssueActions({
	issue,
	onEdit,
	onDeleted,
}: {
	issue: Issue;
	onEdit: Props["onEdit"];
	onDeleted: Props["onDeleted"];
}) {
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function handleDelete() {
		setIsLoading(true);
		await deleteIssue(issue.id);
		setIsLoading(false);
		setOpenDeleteModal(false);
		onDeleted(issue.id);
	}

	return (
		<>
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
					<DropdownMenuItem onClick={() => onEdit(issue)}>
						<Settings2 />
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						asChild
						variant="destructive"
						onClick={() => setOpenDeleteModal(true)}
					>
						<button type="button" className="flex w-full items-center gap-2">
							<Trash2 />
							Delete
						</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the issue
							from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							type="button"
							variant="destructive"
							disabled={isLoading}
							onClick={handleDelete}
						>
							{isLoading ? <Spinner className="mr-2" /> : "Delete"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default function IssuesTable({ issues, onEdit, onDeleted }: Props) {
	if (issues.length === 0) {
		return (
			<div className="flex items-center justify-center h-[calc(100vh-11rem)]">
				<p className="text-sm text-muted-foreground">No issues found.</p>
			</div>
		);
	}

	return (
		<div className="w-full rounded-md border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-4">Title</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Assignee</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{issues.map(issue => (
						<TableRow key={issue.id}>
							<TableCell className="font-medium pl-4">{issue.title}</TableCell>
							<TableCell>
								<IssueType issueType={issue.type} />
							</TableCell>
							<TableCell>
								<Status status={issue.status} />
							</TableCell>
							<TableCell>
								<Priority priority={issue.priority} />
							</TableCell>
							<TableCell>{issue.user_name ?? "Unassigned"}</TableCell>
							<TableCell>
								<IssueActions issue={issue} onEdit={onEdit} onDeleted={onDeleted} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
