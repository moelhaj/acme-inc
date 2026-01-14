import { fetchProjectsPages } from "@/actions/project";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import Table from "./table/table";
import Toolbar from "./table/toolbar";

export default async function Projects(props: {
	searchParams?: Promise<{
		query?: string;
		page?: string;
		items?: string;
		status?: string;
		priority?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const query = searchParams?.query || "";
	const currentPage = Number(searchParams?.page) || 1;
	const itemsPerPage = Number(searchParams?.items) || 6;
	const status = searchParams?.status || "";
	const priority = searchParams?.priority || "";
	const totalPages = await fetchProjectsPages(query, itemsPerPage, status, priority);

	return (
		<div className="p-4 w-full flex flex-col gap-4 overflow-x-hidden">
			<Toolbar />
			<Suspense
				key={query + currentPage + itemsPerPage}
				fallback={
					<div className="w-full h-[60vh] grid place-content-center">
						<Spinner />
					</div>
				}
			>
				<Table
					query={query}
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					totalPages={totalPages}
					status={status}
					priority={priority}
				/>
			</Suspense>
		</div>
	);
}
