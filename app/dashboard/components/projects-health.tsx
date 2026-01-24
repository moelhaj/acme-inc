import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type ProjectHealthRow = {
	projectId: string;
	projectName: string;
	completionPercent: number;
	openIssuesCount: number;
	urgentIssuesCount: number;
	healthScore: number;
	status: "Healthy" | "At Risk" | "Blocked";
};

type ProjectsHealthProps = {
	data: ProjectHealthRow[];
};

const statusBadgeClass = (status: ProjectHealthRow["status"]) => {
	switch (status) {
		case "Healthy":
			return "bg-emerald-500/15 text-emerald-600 border-emerald-500/20";
		case "At Risk":
			return "bg-amber-500/15 text-amber-700 border-amber-500/20";
		case "Blocked":
		default:
			return "bg-rose-500/15 text-rose-600 border-rose-500/20";
	}
};

export default function ProjectsHealth({ data }: ProjectsHealthProps) {
	const sortedData = [...data].sort((a, b) => {
		if (b.completionPercent !== a.completionPercent) {
			return b.completionPercent - a.completionPercent;
		}
		return b.openIssuesCount - a.openIssuesCount;
	});

	return (
		<Card className="h-[calc(100svh-5rem)] overflow-hidden overflow-y-scroll">
			<CardHeader className="pb-2">
				<CardTitle>Projects Health</CardTitle>
				<CardDescription>Overview by project</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Project</TableHead>
							<TableHead>% Completed</TableHead>
							<TableHead>Open Issues</TableHead>
							<TableHead>Urgent Issues</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedData.map(project => (
							<TableRow key={project.projectId}>
								<TableCell className="font-medium">{project.projectName}</TableCell>
								<TableCell>{project.completionPercent}%</TableCell>
								<TableCell>{project.openIssuesCount}</TableCell>
								<TableCell>{project.urgentIssuesCount}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={statusBadgeClass(project.status)}
									>
										{project.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-muted-foreground text-center py-6"
								>
									No projects found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
