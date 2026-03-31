import ThemeToggle from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BreadCrumb } from "./bread-crumb"

export default function Header() {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 transition-[width,height] ease-linear">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:-ml-1" />
                    <BreadCrumb />
                </div>
                <ThemeToggle />
            </div>
        </header>
    )
}
