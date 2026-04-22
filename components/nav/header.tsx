import { ThemeToggle } from "./theme-toggle"
import { SidebarTrigger } from "../ui/sidebar"

export default function Header() {
    return (
        <header className="flex shrink-0 items-center p-3 pb-0 md:hidden">
            <SidebarTrigger size="icon" variant="secondary" />
            <div className="flex-1" />
            <ThemeToggle />
        </header>
    )
}
