import { fetchProjectHealth, fetchTasksByPriority, fetchTasksByStatus } from "@/actions/dashboard";
import ProjectsHealth from "./components/projects-health";
import TasksStatus from "./components/tasks-status";
import TasksPriorities from "./components/tasks-priorities";

export default async function Page() {
	const [tasksByPriority, tasksByStatus, projectHealth] = await Promise.all([
		fetchTasksByPriority(),
		fetchTasksByStatus(),
		fetchProjectHealth(),
	]);

	return (
		<div className="w-full p-4 pb-2.5 md:pl-2 h-[calc(100svh-4rem)] overflow-y-scroll">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
				{/* first column */}
				<div className="h-full flex flex-col gap-4 lg:col-span-1">
					<TasksPriorities data={tasksByPriority} />
					<TasksStatus data={tasksByStatus} />
				</div>
				{/* second column */}
				<div className="lg:col-span-3">
					<ProjectsHealth data={projectHealth} />
				</div>
			</div>
		</div>
	);
}
