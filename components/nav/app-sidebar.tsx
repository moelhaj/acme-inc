import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { SessionPayload } from "@/lib/auth"
import { AiBrain05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { SidebarTrigger } from "./sidebar-trigger"
import { AppLogo } from "./app-logo"

type SidebarUser = SessionPayload["user"]

export function AppSidebar({ user }: { user: SidebarUser | null }) {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="px-0 hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <AppLogo />
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
                <NavProjects />
            </SidebarContent>
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
            <div className="absolute top-1/2 left-full -ml-3.5 hidden -translate-y-1/2 md:block">
                <SidebarTrigger />
            </div>
        </Sidebar>
    )
}
