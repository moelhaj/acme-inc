import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Priorities, Project, Statuses } from "@/lib/definitions";
import { Actions } from "./actions";

export default function project_card({ project }: { project: Project }) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{project.title}</CardTitle>
				<CardDescription>{project.description}</CardDescription>
				<CardAction>
					<Actions id={project.id} title={project.title} />
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4 items-center text-xs">
					<div className="flex flex-col gap-1 px-4 py-2 bg-muted flex-1 rounded-md">
						<span className="text-muted-foreground">Priority</span>
						<div className="flex items-center gap-2">
							{project.priority === "urgent" && (
								<span className="relative flex size-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
									<span className="relative inline-flex size-2 rounded-full bg-rose-500"></span>
								</span>
							)}
							<span>
								{
									Priorities.find(priority => priority.value === project.priority)
										?.label
								}
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-1 px-4 py-2 bg-muted flex-1 rounded-md">
						<span className="text-muted-foreground">Status</span>
						<span>
							{Statuses.find(status => status.value === project.status)?.label}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
