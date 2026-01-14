import { fetchFilteredProjects } from "@/actions/project";
import Pagination from "./pagination";
import ProjectCard from "./card";

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
		priority
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
			<div className="flex w-full">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
					{projects.map(project => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
			<div className="flex w-full justify-center">
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
}
