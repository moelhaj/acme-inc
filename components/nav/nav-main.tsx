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
  DashboardSquare01Icon,
  Blockchain04Icon,
} from "@hugeicons/core-free-icons"

const links = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: <HugeiconsIcon icon={Blockchain04Icon} strokeWidth={2} />,
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
              className="cursor-pointer rounded-md data-active:font-normal"
              isActive={pathname === link.url}
              asChild
            >
              <Link
                href={link.url}
                className="flex items-center gap-2 select-none"
              >
                <span className="flex items-center">{link.icon}</span>
                <span>{link.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
