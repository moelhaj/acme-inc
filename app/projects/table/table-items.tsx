import { Statuses, Priorities, Types } from "@/lib/definitions";

export function Status({ status }: { status: string }) {
	const statusInfo = Statuses.find(s => s.value === status);
	return <span>{statusInfo ? statusInfo.label : status}</span>;
}

export function Priority({ priority }: { priority: string }) {
	const priorityInfo = Priorities.find(p => p.value === priority);
	if (priority === "urgent") {
		return (
			<div className="flex items-center gap-2">
				<span className="relative flex size-2">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
					<span className="relative inline-flex size-2 rounded-full bg-rose-500"></span>
				</span>
				<span>{priorityInfo ? priorityInfo.label : priority}</span>
			</div>
		);
	}
	return <span>{priorityInfo ? priorityInfo.label : priority}</span>;
}

export function IssueType({ issueType }: { issueType: string }) {
	const typeInfo = Types.find(t => t.value === issueType);
	return <span>{typeInfo ? typeInfo.label : issueType}</span>;
}
