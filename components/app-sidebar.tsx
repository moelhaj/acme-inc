"use client";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User } from "@/lib/definitions";
import { SquaresExclude } from "lucide-react";

export function AppSidebar({ user }: { user: User | null }) {
	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-none"
				>
					<div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						<SquaresExclude className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">Acme Inc</span>
						<span className="truncate text-xs">Enterprise</span>
					</div>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<NavProjects />
			</SidebarContent>
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
		</Sidebar>
	);
}
