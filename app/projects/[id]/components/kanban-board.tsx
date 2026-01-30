"use client";
import { updateIssuePositions } from "@/actions/issues";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
	type DragEndEvent,
} from "@/components/ui/kanban2";
import { Issue, Priorities, Statuses, Types } from "@/lib/definitions";
import { Activity, Fragment, useEffect, useRef, useState, useTransition } from "react";
import { CreateIssue } from "./create-issue";
import { Filter } from "./filter-issue";
import IssuesTable from "./issues-table";
import { UpdateIssue } from "./update-issue";
import IssueCard from "./issue-card";
import { LayoutGrid, SquareKanban, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import KanbanToolbar from "./kanban-toolbar";

const COLUMNS = [
	{ id: "todo", name: "Todo", color: "#F43F5E" },
	{ id: "in_progress", name: "In Progress", color: "#F59E0B" },
	{ id: "in_review", name: "In Review", color: "#6366F1" },
	{ id: "done", name: "Done", color: "#10B981" },
] as const;

type Column = (typeof COLUMNS)[number];
type ColumnKey = Issue["status"];

export type IssueWithUser = Issue & {
	user_name?: string | null;
	user_avatar?: string | null;
};

type KanbanIssue = IssueWithUser & {
	column: ColumnKey;
	name: string;
};

const buildItems = (issues: IssueWithUser[]): KanbanIssue[] => {
	const columns: Record<ColumnKey, KanbanIssue[]> = {
		todo: [],
		in_progress: [],
		in_review: [],
		done: [],
	};

	for (const issue of issues) {
		columns[issue.status].push({
			...issue,
			column: issue.status,
			name: issue.title,
		});
	}

	for (const tasks of Object.values(columns)) {
		tasks.sort((a, b) => a.position - b.position);
	}

	return COLUMNS.flatMap(column => columns[column.id]);
};

const syncStatus = (items: KanbanIssue[]) => items.map(item => ({ ...item, status: item.column }));

const applyPositions = (items: KanbanIssue[]) => {
	const columns: Record<ColumnKey, KanbanIssue[]> = {
		todo: [],
		in_progress: [],
		in_review: [],
		done: [],
	};

	for (const item of items) {
		columns[item.column].push(item);
	}

	const positions = new Map<string, number>();
	for (const column of COLUMNS) {
		const columnItems = columns[column.id];
		columnItems.forEach((item, index) => {
			positions.set(item.id, index);
		});
	}

	return items.map(item => ({
		...item,
		position: positions.get(item.id) ?? item.position,
	}));
};

const buildUpdates = (items: KanbanIssue[]) => {
	const columns: Record<ColumnKey, KanbanIssue[]> = {
		todo: [],
		in_progress: [],
		in_review: [],
		done: [],
	};

	for (const item of items) {
		columns[item.column].push(item);
	}

	return COLUMNS.flatMap(column =>
		columns[column.id].map((item, index) => ({
			id: item.id,
			status: column.id,
			position: index,
		})),
	);
};

export default function KanbanBoardView({
	issues,
	projectId,
}: {
	issues: IssueWithUser[];
	projectId: string;
}) {
	const [openUpdateSheet, setOpenUpdateSheet] = useState(false);
	const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
	const [view, setView] = useState<"board" | "table">("board");

	const [items, setItems] = useState<KanbanIssue[]>(() => buildItems(issues));
	const [, startTransition] = useTransition();
	const itemsRef = useRef(items);
	const ignoreNextDataChange = useRef(false);

	useEffect(() => {
		setItems(buildItems(issues));
	}, [issues]);

	useEffect(() => {
		itemsRef.current = items;
	}, [items]);

	const columns: Column[] = [...COLUMNS];

	const handleEditIssue = (issue: Issue) => {
		setSelectedIssue(issue);
		setOpenUpdateSheet(true);
	};

	const handleDeleteIssue = (issueId: string) => {
		setItems(prev => prev.filter(item => item.id !== issueId));
	};

	function handleDragEnd(event: DragEndEvent) {
		if (!event.over) return;

		const current = itemsRef.current;
		const activeId = String(event.active.id);
		const overId = String(event.over.id);

		let next = current;
		const activeIndex = current.findIndex(item => item.id === activeId);
		if (activeIndex !== -1 && activeId !== overId) {
			const overItem = current.find(item => item.id === overId);
			const overColumn = columns.find(column => column.id === overId)?.id;
			const targetColumn = overItem?.column ?? overColumn;

			if (targetColumn) {
				next = [...current];
				const [moved] = next.splice(activeIndex, 1);
				moved.column = targetColumn;

				if (overItem) {
					const overIndex = next.findIndex(item => item.id === overId);
					next.splice(overIndex, 0, moved);
				} else {
					let lastIndex = -1;
					for (let i = next.length - 1; i >= 0; i -= 1) {
						if (next[i].column === targetColumn) {
							lastIndex = i;
							break;
						}
					}
					if (lastIndex === -1) {
						next.push(moved);
					} else {
						next.splice(lastIndex + 1, 0, moved);
					}
				}
			}
		}

		const withPositions = applyPositions(syncStatus(next));
		ignoreNextDataChange.current = true;
		setItems(withPositions);

		if (projectId) {
			const updates = buildUpdates(withPositions);
			startTransition(() => {
				void updateIssuePositions(projectId, updates);
			});
		}
	}

	const handleDataChange = (nextData: KanbanIssue[]) => {
		if (ignoreNextDataChange.current) {
			ignoreNextDataChange.current = false;
			return;
		}
		setItems(syncStatus(nextData));
	};

	return (
		<Fragment>
			<KanbanToolbar projectId={projectId} view={view} setView={setView} />
			<div className="lg:hidden w-full h-full p-4">
				<IssuesTable
					issues={items}
					onEdit={handleEditIssue}
					onDeleted={handleDeleteIssue}
				/>
			</div>
			<div className="hidden lg:block">
				{view === "table" ? (
					<div className="p-4">
						<IssuesTable
							issues={items}
							onEdit={handleEditIssue}
							onDeleted={handleDeleteIssue}
						/>
					</div>
				) : (
					<Fragment>
						<Activity mode={issues.length === 0 ? "visible" : "hidden"}>
							<div className="flex items-center justify-center h-[calc(100vh-11rem)]">
								<p className="text-sm text-muted-foreground">No issues found.</p>
							</div>
						</Activity>
						<Activity mode={issues.length > 0 ? "visible" : "hidden"}>
							<KanbanProvider
								columns={columns}
								data={items}
								onDataChange={handleDataChange}
								onDragEnd={handleDragEnd}
								className="p-4 h-[calc(100vh-8rem)] overflow-hidden"
							>
								{(column: Column) => (
									<KanbanBoard
										id={column.id}
										key={column.id}
										className="bg-muted/50 p-2 rounded-lg shadow-none border-none"
									>
										<KanbanHeader className="px-4 border rounded-lg bg-background">
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<div
														className="h-2 w-2 rounded-full"
														style={{ backgroundColor: column.color }}
													/>
													<span>{column.name}</span>
												</div>
												<span className="text-muted-foreground">
													{
														items.filter(
															item => item.column === column.id,
														).length
													}
												</span>
											</div>
										</KanbanHeader>
										<KanbanCards id={column.id}>
											{(issue: KanbanIssue) => (
												<KanbanCard
													column={column.id}
													id={issue.id}
													key={issue.id}
													name={issue.title}
												>
													<IssueCard issue={issue} />
												</KanbanCard>
											)}
										</KanbanCards>
									</KanbanBoard>
								)}
							</KanbanProvider>
						</Activity>
					</Fragment>
				)}
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
