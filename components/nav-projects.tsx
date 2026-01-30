"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import useApp from "@/hooks/use-app";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavProjects() {
	const { pinnedProjects } = useApp();
	const pathname = usePathname();

	const matchesPath = (path: string, target: string) => {
		if (!path || !target) return false;
		if (path === target) return true;
		return path.startsWith(target) && ["/", "?", "#"].includes(path[target.length] ?? "");
	};

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			{pinnedProjects.length === 0 ? (
				<p className="px-2 text-xs text-muted-foreground">Pin a project to see it here.</p>
			) : (
				<SidebarMenu>
					{pinnedProjects.map(item => {
						const projectId = item.id != null ? String(item.id) : "";
						const projectPath = projectId ? `/projects/${projectId}` : "";
						const isActive =
							matchesPath(pathname, item.url ?? "") ||
							matchesPath(pathname, projectPath);

						return (
							<SidebarMenuItem key={item.id ?? item.title}>
								<SidebarMenuButton asChild>
									<Link href={item.url ?? `/projects/${item.id ?? ""}`}>
										<div
											className={cn(
												"w-2 h-2 rounded-full bg-sidebar-foreground/10",
												isActive && "bg-sidebar-foreground/40",
											)}
										/>
										<span
											className={cn(
												"truncate",
												isActive
													? "text-foreground"
													: "text-muted-foreground",
											)}
										>
											{item.title}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
}
