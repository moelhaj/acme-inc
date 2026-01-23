"use client";
import { FolderTree, LayoutGrid, SquaresExclude } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { User } from "@/lib/definitions";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutGrid,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: FolderTree,
		},
	],
};

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: User | null }) {
	return (
		<Sidebar collapsible="icon" variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="bg-primary text-white flex aspect-square size-8 items-center justify-center rounded-lg">
						<SquaresExclude className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">Acme Inc</span>
						<span className="truncate text-xs">Enterprise</span>
					</div>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects />
			</SidebarContent>
			<SidebarFooter>
				{user && <NavUser user={user} />}
			</SidebarFooter>
		</Sidebar>
	);
}
