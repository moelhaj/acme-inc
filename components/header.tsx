"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { fetchProjectById } from "@/actions/project";

export function Header() {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(segment => segment !== "");
	const [projectTitles, setProjectTitles] = useState<Record<string, string>>({});
	const projectId = useMemo(() => {
		const projectsIndex = pathSegments.indexOf("projects");
		if (projectsIndex === -1) return null;
		const id = pathSegments[projectsIndex + 1];
		if (!id) return null;
		return /^[0-9a-f-]{36}$/i.test(id) ? id : null;
	}, [pathSegments]);

	useEffect(() => {
		if (!projectId || projectTitles[projectId]) return;
		let isMounted = true;
		(async () => {
			try {
				const project = await fetchProjectById(projectId);
				if (isMounted && project?.title) {
					setProjectTitles(prev => ({ ...prev, [projectId]: project.title }));
				}
			} catch (error) {
				console.error("Failed to load project title", error);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [projectId, projectTitles]);

	const breadcrumbItems = pathSegments.map((segment, index) => {
		const href = "/" + pathSegments.slice(0, index + 1).join("/");
		const label = projectTitles[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1); // Basic capitalization

		return (
			<BreadcrumbItem key={href}>
				<BreadcrumbLink asChild>
					<Link href={href}>{label}</Link>
				</BreadcrumbLink>
			</BreadcrumbItem>
		);
	});
	return (
		<header className="flex p-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
			<div className="flex items-center gap-2 w-full">
				<SidebarTrigger />
				<div className="flex-1 flex md:hidden" />
				<Breadcrumb className="hidden md:flex">
					<BreadcrumbList>
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={`breadcrumb-${index}`}>
								{item}
								{index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="flex-1 md:flex hidden" />
			</div>
		</header>
	);
}

// import {
// 	Breadcrumb,
// 	BreadcrumbItem,
// 	BreadcrumbLink,
// 	BreadcrumbList,
// 	BreadcrumbPage,
// 	BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import { SidebarTrigger } from "@/components/ui/sidebar";

// export default function Header() {
// 	return (
// 		<header className="flex h-16 shrink-0 items-center gap-2">
// 			<div className="flex items-center gap-2 px-4">
// 				<SidebarTrigger className="-ml-1" />
// 				<Separator
// 					orientation="vertical"
// 					className="mr-2 data-[orientation=vertical]:h-4"
// 				/>
// 				<Breadcrumb>
// 					<BreadcrumbList>
// 						<BreadcrumbItem className="hidden md:block">
// 							<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
// 						</BreadcrumbItem>
// 						<BreadcrumbSeparator className="hidden md:block" />
// 						<BreadcrumbItem>
// 							<BreadcrumbPage>Data Fetching</BreadcrumbPage>
// 						</BreadcrumbItem>
// 					</BreadcrumbList>
// 				</Breadcrumb>
// 			</div>
// 		</header>
// 	);
// }
