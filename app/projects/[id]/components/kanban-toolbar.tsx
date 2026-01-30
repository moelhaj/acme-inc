"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Priorities, Statuses, Types } from "@/lib/definitions";
import { SquareKanban, Table2 } from "lucide-react";
import { CreateIssue } from "./create-issue";
import { Filter } from "./filter-issue";

type Props = {
	projectId: string;
	view: "board" | "table";
	setView: (view: "board" | "table") => void;
};

export default function KanbanToolbar({ projectId, view, setView }: Props) {
	return (
		<header className="flex items-center justify-between px-4 pt-4">
			<div className="flex items-center gap-2">
				<Filter options={Statuses} label="Status" />
				<Filter options={Priorities} label="Priority" />
				<Filter options={Types} label="Type" />
			</div>
			<div className="flex items-center gap-2">
				<div className="hidden lg:flex items-center gap-2">
					<ToggleGroup variant="outline" type="single" defaultValue={view}>
						<Tooltip>
							<TooltipTrigger asChild>
								<ToggleGroupItem value="board" onClick={() => setView("board")}>
									<SquareKanban className="h-4 w-4" />
								</ToggleGroupItem>
							</TooltipTrigger>
							<TooltipContent className="px-2 py-1 text-xs">
								<p>Kanban Board</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<ToggleGroupItem value="table" onClick={() => setView("table")}>
									<Table2 className="h-4 w-4" />
								</ToggleGroupItem>
							</TooltipTrigger>
							<TooltipContent className="px-2 py-1 text-xs">
								<p>Table</p>
							</TooltipContent>
						</Tooltip>
					</ToggleGroup>
				</div>
				<CreateIssue projectId={projectId} />
			</div>
		</header>
	);
}
