import { fetchFilteredIssues } from "@/actions/issues";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import KanbanBoard from "./components/kanban-board";

export default async function Project(props: {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{
		status?: string;
		priority?: string;
		type?: string;
	}>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const status = searchParams?.status || "";
	const priority = searchParams?.priority || "";
	const type = searchParams?.type || "";
	const id = params.id;

	const issues = await fetchFilteredIssues(id, type, status, priority);
	if (!issues) {
		notFound();
	}
	return (
		<Suspense>
			<KanbanBoard issues={issues} projectId={id} />
		</Suspense>
	);
}
