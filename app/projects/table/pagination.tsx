"use client";
import { Activity } from "react";
import clsx from "clsx";
import Link from "next/link";
import { cn, generatePagination } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({ totalPages }: { totalPages: number }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;
	const itemsPerPage = searchParams.get("items") || "10";
	const router = useRouter();

	const createPageURL = (pageNumber: number | string, itemsPerPage: string = "10") => {
		const params = new URLSearchParams(searchParams);
		params.set("page", pageNumber.toString());
		params.set("items", itemsPerPage.toString());
		return `${pathname}?${params.toString()}`;
	};

	const allPages = generatePagination(currentPage, totalPages);

	return (
		<Activity mode={totalPages > 0 ? "visible" : "hidden"}>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<h4 className="font-medium">Rows per page</h4>
					<Select
						value={searchParams.get("items") || itemsPerPage}
						onValueChange={value => {
							const url = createPageURL(1, value);
							router.push(url);
						}}
					>
						<SelectTrigger className="w-fit">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
								<SelectItem value="40">40</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-4">
					<Button asChild size="icon" variant="outline">
						<Link
							href={createPageURL(currentPage - 1, itemsPerPage)}
							className={clsx({
								"pointer-events-none text-gray-300": currentPage <= 1,
							})}
						>
							<ChevronLeft className="w-4" />
						</Link>
					</Button>
					<div className="flex space-x-1">
						{allPages.map((page, index) => {
							return (
								<Button
									asChild
									key={`${page}-${index}`}
									size="icon"
									variant="outline"
									disabled={page === "..."}
									className={cn(
										page === currentPage &&
											"pointer-events-none bg-primary text-white dark:bg-primary dark:text-white"
									)}
								>
									<Link href={createPageURL(page, itemsPerPage)}>{page}</Link>
								</Button>
							);
						})}
					</div>
					<Button asChild size="icon" variant="outline">
						<Link
							href={createPageURL(currentPage + 1, itemsPerPage)}
							className={clsx({
								"pointer-events-none text-gray-300": currentPage >= totalPages,
							})}
						>
							<ChevronRight className="w-4" />
						</Link>
					</Button>
				</div>
			</div>
		</Activity>
	);
}
