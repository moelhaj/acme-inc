"use client"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function SidebarTrigger() {
    const { open, toggleSidebar } = useSidebar()

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="secondary"
            size="icon-xs"
            onClick={() => {
                toggleSidebar()
            }}
        >
            <HugeiconsIcon
                icon={open ? ArrowLeft01Icon : ArrowRight01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
            />
        </Button>
    )
}
