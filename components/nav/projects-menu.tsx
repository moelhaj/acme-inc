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

const MAX_TITLE_LENGTH = 25

export function ProjectsMenu({ projects }: { projects: Props[] }) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => {
                    const projectUrl = `/tasks/${item.id}`
                    const isActive = pathname === projectUrl

                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton asChild>
                                <Link
                                    href={projectUrl}
                                    className="flex h-full w-full items-center gap-2 text-xs"
                                >
                                    <div
                                        className={cn(
                                            "h-2 w-2 rounded-full bg-sidebar-foreground/10",
                                            isActive && "bg-primary"
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
                                        {item.title.length > MAX_TITLE_LENGTH
                                            ? `${item.title.slice(0, MAX_TITLE_LENGTH)}...`
                                            : item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
