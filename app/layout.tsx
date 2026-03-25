import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const fontSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
})

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const metadata: Metadata = {
    title: {
        template: "%s | Acme-Inc",
        default: "Acme-Inc",
    },
    description:
        "AI assisted project management for developers. Get insights, track issues, and optimize your workflow with Acme-Inc.",
    metadataBase: new URL("https://acme-inc-ashen.vercel.app"),
    keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Server Components",
        "Shadcn",
        "AI Integration",
    ],
    authors: [
        {
            name: "Mohamed Elhaj",
            url: "https://moelhaj.github.io/",
        },
    ],
    creator: "Mohamed Elhaj",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://acme-inc-ashen.vercel.app/",
        title: "Acme-Inc",
        description:
            "AI assisted project management for developers. Get insights, track issues, and optimize your workflow with Acme-Inc.",
        siteName: "Acme-Inc",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "antialiased",
                fontMono.variable,
                "font-sans",
                fontSans.variable
            )}
        >
            <body className="text-sm">
                <ThemeProvider>
                    <TooltipProvider>
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset>
                                <Header />
                                <div className="h-[calc(100svh-5rem)] w-full overflow-hidden overflow-y-auto">
                                    {children}
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
