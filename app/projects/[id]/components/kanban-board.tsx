"use client";
import { updateIssuePositions } from "@/actions/issues";
import { Badge } from "@/components/ui/badge";
import * as Kanban from "@/components/ui/kanban";
import { Issue, Priorities, Statuses } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Activity, Fragment, useEffect, useState, useTransition } from "react";
import { CreateIssue } from "./create-issue";
import { Filter } from "./filter-issue";
import IssueCard from "./issue-card";
import { UpdateIssue } from "./update-issue";

type ColumnKey = Issue["status"];

const COLUMNS_TITLES = [
	{
		value: "todo",
		label: "Todo",
		color: "bg-rose-500",
		headerBg: "bg-rose-500/30",
	},
	{
		value: "in_progress",
		label: "In Progress",
		color: "bg-yellow-500",
		headerBg: "bg-yellow-500/30",
	},
	{
		value: "in_review",
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

const buildColumns = (issues: Issue[]): Record<ColumnKey, Issue[]> => {
	const columns: Record<ColumnKey, Issue[]> = {
		todo: [],
		in_progress: [],
		in_review: [],
		done: [],
	};

	for (const issue of issues) {
		columns[issue.status].push(issue);
	}

	for (const tasks of Object.values(columns)) {
		tasks.sort((a, b) => a.position - b.position);
	}

	return columns;
};

export default function KanbanBoard({ issues, projectId }: { issues: Issue[]; projectId: string }) {
	const [openUpdateSheet, setOpenUpdateSheet] = useState(false);
	const [columns, setColumns] = useState<Record<ColumnKey, Issue[]>>(() => buildColumns(issues));
	const [, startTransition] = useTransition();
	const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

	useEffect(() => {
		setColumns(buildColumns(issues));
	}, [issues]);

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
					<CreateIssue projectId={projectId} />
				</header>
				<Activity mode={issues.length === 0 ? "visible" : "hidden"}>
					<div className="flex items-center justify-center h-[calc(100vh-11rem)]">
						<p className="text-sm text-muted-foreground">No issues found.</p>
					</div>
				</Activity>
				<Activity mode={issues.length > 0 ? "visible" : "hidden"}>
					<Kanban.Root
						value={columns}
						onValueChange={setColumns}
						onDragEnd={event => {
							if (!event.over) return;
							const activeId = event.active.id;
							const overId = event.over.id;
							const findColumn = (id: string) => {
								if (id in columns) return id as ColumnKey;
								return Object.entries(columns).find(([, items]) =>
									items.some(item => item.id === id),
								)?.[0] as ColumnKey | undefined;
							};

							const activeColumn = findColumn(String(activeId));
							const overColumn = findColumn(String(overId));

							if (!activeColumn || !overColumn) return;

							const columnsToUpdate = new Set<ColumnKey>([activeColumn, overColumn]);
							const updates = Array.from(columnsToUpdate).flatMap(columnKey =>
								columns[columnKey].map((item, index) => ({
									id: item.id,
									status: columnKey,
									position: index,
								})),
							);

							startTransition(() => {
								void updateIssuePositions(projectId, updates);
							});
						}}
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
													<IssueCard
														key={task.id}
														task={{
															...task,
															user_name: task.user_name ?? undefined,
															user_avatar: task.user_avatar ?? null,
															user_id: task.user_id ?? undefined,
														}}
														setOpenUpdateSheet={setOpenUpdateSheet}
														setSelectedIssue={issue =>
															setSelectedIssue(issue)
														}
													/>
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
				</Activity>
			</div>
			{selectedIssue && (
				<UpdateIssue
					open={openUpdateSheet}
					setOpen={setOpenUpdateSheet}
					issue={selectedIssue}
				/>
			)}
		</Fragment>
	);
}
