import { fetchFilteredProjects } from "@/actions/project";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Actions } from "./actions";
import Pagination from "./pagination";
import { Priority, Status } from "./table-items";
import Link from "next/link";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function ProjectsTable({
	query,
	currentPage,
	itemsPerPage,
	totalPages,
	status,
	priority,
}: {
	query: string;
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	status: string;
	priority: string;
}) {
	const projects = await fetchFilteredProjects(
		query,
		currentPage,
		itemsPerPage,
		status,
		priority,
	);

	if (projects.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-center text-muted-foreground">
				No projects found.
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 gap-4">
			<div className="lg:hidden">
				<div className="grid gap-4 sm:grid-cols-2">
					{projects.map(project => (
						<Card key={project.id}>
							<CardHeader>
								<CardTitle>
									<Link
										href={`/projects/${project.id}`}
										className="block truncate font-medium hover:underline"
									>
										{project.title}
									</Link>
								</CardTitle>
								<CardDescription>{project.description}</CardDescription>
								<CardAction>
									<Actions project={project} />
								</CardAction>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between">
									<div className="flex flex-col gap-2">
										<p className="text-muted-foreground">Status</p>
										<Status status={project.status} />
									</div>
									<div className="flex flex-col gap-2">
										<p className="text-muted-foreground">Priority</p>
										<Priority priority={project.priority} />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
			<div className="hidden w-full rounded-md border lg:flex bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-25 pl-4">Title</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map(project => (
							<TableRow key={project.id}>
								<TableCell className="font-medium pl-4">
									<Link
										href={`/projects/${project.id}`}
										className="hover:underline"
									>
										{project.title}
									</Link>
								</TableCell>
								<TableCell>{project.description}</TableCell>
								<TableCell>
									<Status status={project.status} />
								</TableCell>
								<TableCell>
									<Priority priority={project.priority} />
								</TableCell>
								<TableCell>
									<Actions project={project} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex w-full justify-end">
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
}
