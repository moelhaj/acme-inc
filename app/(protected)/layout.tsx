import Header from "@/components/nav/header"
import SidebarWrapper from "@/components/nav/sidebar-wrapper"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await getSession()
    if (!session) {
        redirect("/login")
    }
    return (
        <SidebarProvider>
            <SidebarWrapper />
            <SidebarInset>
                <div className="flex h-full flex-col">
                    <Header />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
