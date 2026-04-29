import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { AppLogo } from "./app-logo"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { SidebarTrigger } from "./sidebar-trigger"
import { ThemeToggle } from "./theme-toggle"

export function AppSidebar() {
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
            <SidebarFooter>
                <ThemeToggle />
            </SidebarFooter>
            <div className="absolute top-1/2 left-full -ml-3.5 hidden -translate-y-1/2 md:block">
                <SidebarTrigger />
            </div>
        </Sidebar>
    )
}
