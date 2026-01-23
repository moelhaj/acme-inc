"use client";

import { Priority } from "@/app/projects/table/table-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Kanban from "@/components/ui/kanban";
import { Issue } from "@/lib/definitions";
import { resolveAvatarSrc } from "@/lib/utils";
import { GripVertical } from "lucide-react";

type Props = {
	task: Issue;
	setOpenUpdateSheet: (open: boolean) => void;
	setSelectedIssue?: (issue: Issue) => void;
};

const TYPE_LABELS: Record<Props["task"]["type"], string> = {
	bug: "Bug",
	feature: "Feature",
	improvement: "Improvement",
};

export default function IssueCard({ task, setOpenUpdateSheet, setSelectedIssue }: Props) {
	return (
		<Kanban.Item key={task.id} value={task.id} asChild>
			<Card className="gap-2 py-4">
				<CardHeader>
					<CardTitle>
						<span
							onClick={() => {
								setSelectedIssue?.(task);
								setOpenUpdateSheet(true);
							}}
							className="cursor-pointer underline"
						>
							{task.title}
						</span>
					</CardTitle>
					<CardAction className="pt-1">
						<Kanban.ItemHandle asChild>
							<Button type="button" variant="ghost" size="icon" className="h-7 w-7">
								<GripVertical className="h-4 w-4" />
								<span className="sr-only">Drag</span>
							</Button>
						</Kanban.ItemHandle>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between gap-3">
						<div className="w-full flex flex-col gap-1">
							<p className="text-[11px]">Type</p>
							<p>{TYPE_LABELS[task.type]}</p>
						</div>
						<div className="w-full flex flex-col gap-1">
							<p className="text-[11px]">Priority</p>
							<Priority priority={task.priority} />
						</div>
					</div>
					<div className="mt-4">
						{task.user_name && task.user_avatar && (
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
									<AvatarImage
										src={resolveAvatarSrc(task.user_avatar)}
										alt={task.user_name}
										className="h-6 w-6 rounded-full object-contain"
									/>
									<AvatarFallback className="rounded-lg">
										{task.user_name
											.split(" ")
											.map(name => name[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<span className="line-clamp-2 text-xs text-muted-foreground">
									{task.user_name}
								</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Kanban.Item>
	);
}
