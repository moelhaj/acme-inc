"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    Blockchain04Icon,
    DashboardSquare02Icon,
} from "@hugeicons/core-free-icons"

const links = [
    {
        title: "Dashboard",
        url: "/",
        icon: DashboardSquare02Icon,
    },
    {
        title: "Projects",
        url: "/projects",
        icon: Blockchain04Icon,
    },
]

export function NavMain() {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()
    return (
        <SidebarGroup>
            <SidebarMenu className="gap-1">
                {links.map((link) => (
                    <SidebarMenuItem key={link.title}>
                        <SidebarMenuButton
                            onClick={() => setOpenMobile(false)}
                            tooltip={link.title}
                            className="cursor-pointer rounded-md"
                            isActive={pathname === link.url}
                            render={<Link href={link.url} />}
                        >
                            {link.icon && (
                                <HugeiconsIcon
                                    icon={link.icon}
                                    strokeWidth={2}
                                />
                            )}
                            <span>{link.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
