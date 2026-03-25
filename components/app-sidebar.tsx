import { NavMain } from "@/components/nav-main"
import NavProjects from "@/components/nav-projects"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { AiBrain05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="hover:bg-none data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-white">
                        <HugeiconsIcon icon={AiBrain05Icon} strokeWidth={1} />
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
        </Sidebar>
    )
}
