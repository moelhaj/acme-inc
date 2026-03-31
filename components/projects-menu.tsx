"use client"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
    id: string
    title: string
}

export function ProjectsMenu({ projects }: { projects: Props[] }) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => {
                    const projectUrl = `/projects/${item.id}`
                    const isActive = pathname === projectUrl

                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                render={
                                    <Link
                                        href={projectUrl}
                                        className="flex h-full w-full items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                "h-2 w-2 rounded-full bg-sidebar-foreground/10",
                                                isActive &&
                                                    "bg-sidebar-foreground/40"
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "truncate",
                                                isActive
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {item.title.slice(0, 25)}
                                        </span>
                                    </Link>
                                }
                            />
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
