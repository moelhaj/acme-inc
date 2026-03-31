import { NavMain } from "@/components/nav-main"
import NavProjects from "@/components/nav-projects"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { AiBrain05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { NavUser } from "./nav-user"
import { User } from "@/lib/generated/prisma/client"

export function AppSidebar({ user }: { user: User | null }) {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="hover:bg-none data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    )
}
