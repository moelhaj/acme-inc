"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Kanban from "@/components/ui/kanban";
import { GripVertical } from "lucide-react";
import { Fragment, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Priority } from "@/app/projects/table/table-items";
import { CreateIssue } from "./components/create-issue";
import { Priorities, Statuses } from "@/lib/definitions";
import { Filter } from "./components/filters";
import { UpdateIssue } from "./components/update-issue";

interface Task {
	id: string;
	title: string;
	priority: "low" | "medium" | "high";
	assignee?: string;
	dueDate?: string;
}

const COLUMNS_TITLES = [
	{
		value: "todo",
		label: "Todo",
		color: "bg-rose-500",
		headerBg: "bg-rose-500/30",
	},
	{
		value: "inProgress",
		label: "In Progress",
		color: "bg-yellow-500",
		headerBg: "bg-yellow-500/30",
	},
	{
		value: "inReview",
		label: "In Review",
		color: "bg-indigo-500",
		headerBg: "bg-indigo-500/30",
	},
	{
		value: "done",
		label: "Done",
		color: "bg-green-500",
		headerBg: "bg-green-500/30",
	},
];

export default function KanbanDemo() {
	const [openUpdateSheet, setOpenUpdateSheet] = useState(false);
	const [columns, setColumns] = useState<Record<string, Task[]>>({
		todo: [
			{
				id: "1",
				title: "Add authentication",
				priority: "high",
				assignee: "John Doe",
				dueDate: "2024-04-01",
			},
			{
				id: "2",
				title: "Create API endpoints",
				priority: "medium",
				assignee: "Jane Smith",
				dueDate: "2024-04-05",
			},
			{
				id: "3",
				title: "Write documentation",
				priority: "low",
				assignee: "Bob Johnson",
				dueDate: "2024-04-10",
			},
		],
		inProgress: [
			{
				id: "4",
				title: "Design system updates",
				priority: "high",
				assignee: "Alice Brown",
				dueDate: "2024-03-28",
			},
			{
				id: "5",
				title: "Implement dark mode",
				priority: "medium",
				assignee: "Charlie Wilson",
				dueDate: "2024-04-02",
			},
		],
		inReview: [
			{
				id: "6",
				title: "Code review for feature X",
				priority: "medium",
				assignee: "David Green",
				dueDate: "2024-03-30",
			},
		],
		done: [
			{
				id: "7",
				title: "Setup project",
				priority: "high",
				assignee: "Eve Davis",
				dueDate: "2024-03-25",
			},
			{
				id: "8",
				title: "Initial commit",
				priority: "low",
				assignee: "Frank White",
				dueDate: "2024-03-24",
			},
			{
				id: "9",
				title: "Initial commit",
				priority: "low",
				assignee: "Frank White",
				dueDate: "2024-03-24",
			},
		],
	});

	return (
		<Fragment>
			<div className=" xl:hidden w-full h-full py-20 grid place-content-center">
				Kanban view is available on larger screens only.
			</div>
			<div className="hidden xl:block">
				<header className="flex items-center justify-between px-4 pt-4">
					<div className="flex items-center gap-2">
						<Filter options={Statuses} label="Status" />
						<Filter options={Priorities} label="Priority" />
					</div>
					<CreateIssue />
				</header>
				<Kanban.Root
					value={columns}
					onValueChange={setColumns}
					getItemValue={item => item.id}
				>
					<Kanban.Board className="grid auto-rows-fr sm:grid-cols-4 p-4 pl-2">
						{Object.entries(columns).map(([columnValue, tasks]) => {
							const columnHeader = COLUMNS_TITLES.find(
								col => col.value === columnValue,
							);
							return (
								<Kanban.Column key={columnValue} value={columnValue}>
									<div className="flex items-center justify-between pb-0">
										<div
											className={cn(
												"w-full px-4 py-2 rounded-lg flex items-center justify-between gap-2",
												columnHeader?.headerBg,
											)}
										>
											<div className="flex items-center gap-2">
												{/* <div
													className={cn(
														"h-5 w-1.5 rounded-sm",
														columnHeader?.color
													)}
												/> */}
												<h3 className="text-sm font-medium leading-none">
													{columnHeader?.label || columnValue}
												</h3>
											</div>
											<Badge
												variant="secondary"
												className={cn(
													"pointer-events-none rounded-sm text-white",
													columnHeader?.color,
												)}
											>
												{tasks.length}
											</Badge>
										</div>
									</div>
									<div className="h-[calc(100vh-11rem)] overflow-hidden">
										<div className="flex flex-col gap-2 h-full overflow-y-auto">
											{tasks.map(task => (
												<Kanban.Item key={task.id} value={task.id} asChild>
													<Card className="gap-2 py-4">
														<CardHeader>
															<CardTitle>
																<span
																	onClick={() =>
																		setOpenUpdateSheet(true)
																	}
																	className="cursor-pointer"
																>
																	{task.title}
																</span>
															</CardTitle>
															<CardAction className="pt-1">
																<Kanban.ItemHandle asChild>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="h-7 w-7"
																	>
																		<GripVertical className="h-4 w-4" />
																		<span className="sr-only">
																			Drag
																		</span>
																	</Button>
																</Kanban.ItemHandle>
															</CardAction>
														</CardHeader>
														<CardContent>
															<div className="flex justify-between gap-3">
																<div className="w-full flex flex-col gap-1">
																	<p className="text-[11px]">
																		Type
																	</p>
																	<p>Feature</p>
																</div>
																<div className="w-full flex flex-col gap-1">
																	<p className="text-[11px]">
																		Status
																	</p>
																	<p>Done</p>
																</div>
																<div className="w-full flex flex-col gap-1">
																	<p className="text-[11px]">
																		Priority
																	</p>
																	<Priority priority="urgent" />
																</div>
															</div>
															<div className="mt-4">
																{task.assignee && (
																	<span className="line-clamp-1">
																		{task.assignee}
																	</span>
																)}
															</div>
															{/* <Dialog>
															<DialogTrigger asChild>
																<Button
																	variant="outline"
																	className="z-50"
																>
																	Open
																</Button>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[425px]">
																<DialogHeader>
																	<DialogTitle>
																		Edit profile
																	</DialogTitle>
																	<DialogDescription>
																		Make changes to your profile
																		here. Click save when
																		you&apos;re done.
																	</DialogDescription>
																</DialogHeader>
																Hello
																<DialogFooter>
																	<DialogClose asChild>
																		<Button variant="outline">
																			Cancel
																		</Button>
																	</DialogClose>
																	<Button type="submit">
																		Save changes
																	</Button>
																</DialogFooter>
															</DialogContent>
														</Dialog> */}
														</CardContent>
													</Card>
												</Kanban.Item>
											))}
										</div>
									</div>
								</Kanban.Column>
							);
						})}
					</Kanban.Board>
					<Kanban.Overlay>
						<div className="size-full rounded-md bg-muted/40" />
					</Kanban.Overlay>
				</Kanban.Root>
			</div>
			<UpdateIssue open={openUpdateSheet} setOpen={setOpenUpdateSheet} />
		</Fragment>
	);
}
