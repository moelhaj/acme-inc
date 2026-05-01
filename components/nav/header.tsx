import { ThemeToggle } from "./theme-toggle"
import { SidebarTrigger } from "../ui/sidebar"

export default function Header() {
    return (
        <header className="flex w-full items-center p-3 pb-0 md:hidden">
            <SidebarTrigger size="icon" variant="secondary" />
        </header>
    )
}
