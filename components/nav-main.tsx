"use client";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { FolderTree, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
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
];

export function NavMain() {
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();
	return (
		<SidebarGroup>
			<SidebarMenu>
				{links.map(link => (
					<SidebarMenuItem key={link.title}>
						<SidebarMenuButton
							asChild
							tooltip={link.title}
							className="cursor-pointer"
							isActive={pathname.startsWith(link.url)}
						>
							<Link href={link.url} onClick={() => setOpenMobile(false)}>
								{link.icon && <link.icon />}
								<span>{link.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
