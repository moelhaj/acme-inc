"use client"
import { signOut } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { SessionPayload } from "@/lib/auth"
import {
    Logout01Icon,
    MoreVerticalCircle01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ThemeToggle } from "./theme-toggle"
import { userInitials } from "@/lib/utils"

export function NavUser({ user }: { user: SessionPayload["user"] }) {
    const { isMobile } = useSidebar()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="flex h-8 w-8 items-center justify-center">
                                <AvatarImage
                                    src={`/${user.avatar}`}
                                    alt={user.name}
                                    className="h-6 w-6 object-contain"
                                />
                                <AvatarFallback>
                                    {userInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <HugeiconsIcon
                                icon={MoreVerticalCircle01Icon}
                                strokeWidth={2}
                                className="ml-auto size-4"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <div className="grid flex-1 pl-2 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <ThemeToggle sidebar />
                        <DropdownMenuItem
                            onClick={async () => {
                                await signOut()
                                window.location.reload()
                            }}
                        >
                            <HugeiconsIcon
                                icon={Logout01Icon}
                                strokeWidth={2}
                            />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
