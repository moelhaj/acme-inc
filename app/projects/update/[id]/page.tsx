import { fetchProjectById } from "@/actions/project";
import { notFound } from "next/navigation";
import UpdateProjectForm from "../update-form";

export default async function UpdateProjectPage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const project = await fetchProjectById(params.id);

	if (!project) {
		notFound();
	}

	return (
		<div className="space-y-4 p-4">
			<h1 className="text-lg font-semibold">Update project</h1>
			<div className="max-w-2xl">
				<UpdateProjectForm project={project} />
			</div>
		</div>
	);
}
