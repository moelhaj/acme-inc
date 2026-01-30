"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IssueWithUser } from "./kanban-board";

export default function IssueCard({ issue }: { issue: IssueWithUser }) {
	return (
		<div className="flex flex-col items-start justify-between gap-2">
			<div className="flex flex-col gap-1">
				<p className="m-0 flex-1 font-medium text-sm">{issue.title}</p>
				<p>{issue.description}</p>
			</div>
			<div className="flex w-full items-center justify-between">
				<p className="m-0 text-muted-foreground text-xs capitalize">
					{issue.type.replace("_", " ")} • {issue.priority}
				</p>
				{issue.user_name && issue.user_avatar && (
					<Avatar className="h-6 w-6 shrink-0 rounded-lg">
						<AvatarImage
							src={`/${issue.user_avatar}`}
							alt={issue.user_name}
							className="rounded-lg object-contain"
						/>
						<AvatarFallback className="rounded-lg">
							{issue.user_name
								.split(" ")
								.map(name => name[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
		</div>
	);
}
