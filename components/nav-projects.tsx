"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import useApp from "@/hooks/use-app";
import Link from "next/link";

export function NavProjects() {
	const { pinnedProjects } = useApp();
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			{pinnedProjects.length === 0 ? (
				<p className="px-2 text-xs text-muted-foreground">Pin a project to see it here.</p>
			) : (
				<SidebarMenu>
					{pinnedProjects.map(item => (
						<SidebarMenuItem key={item.id ?? item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url ?? `/projects/${item.id ?? ""}`}>
									<span className="truncate">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			)}
		</SidebarGroup>
	);
}
