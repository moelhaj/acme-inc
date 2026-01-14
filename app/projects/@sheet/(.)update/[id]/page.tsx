import { Suspense } from "react";
import UpdateProjectSheet from "../../../update/update-sheet";
import { fetchProjectById } from "@/actions/project";
import { notFound } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default async function UpdateProjectSheetRoute(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;
	const project = await fetchProjectById(id);
	if (!project) {
		notFound();
	}
	return (
		<Suspense
			fallback={
				<div className="w-full h-[60vh] grid place-content-center">
					<Spinner />
				</div>
			}
		>
			<UpdateProjectSheet project={project} />
		</Suspense>
	);
}
