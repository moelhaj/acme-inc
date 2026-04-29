import { AppSidebar } from "@/components/nav/app-sidebar"
import Header from "@/components/nav/header"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

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
            className={cn("antialiased", "font-sans", geist.variable)}
        >
            <body>
                <ThemeProvider>
                    <TooltipProvider>
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset>
                                <div className="flex h-full flex-col">
                                    <Header />
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
