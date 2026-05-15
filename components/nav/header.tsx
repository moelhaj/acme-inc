import { SidebarTrigger } from "@/components/ui/sidebar"
import { AiBrain05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Header() {
  return (
    <header className="flex w-full items-center p-3 pb-0 lg:hidden">
      <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <HugeiconsIcon
          icon={AiBrain05Icon}
          strokeWidth={2}
          className="size-4"
        />
      </div>
      <div className="flex-1" />
      <SidebarTrigger size="icon" variant="secondary" />
    </header>
  )
}
