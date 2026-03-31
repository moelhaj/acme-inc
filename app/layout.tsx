import Header from "@/components/header"
import SidebarWrapper from "@/components/sidebar-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google"
import "./globals.css"

const robotoHeading = Roboto({ subsets: ["latin"], variable: "--font-heading" })

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

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
                geist.variable,
                robotoHeading.variable
            )}
        >
            <body className="overflow-x-auto overflow-y-hidden text-sm">
                <ThemeProvider>
                    <TooltipProvider>
                        <SidebarProvider>
                            <SidebarWrapper />
                            <SidebarInset>
                                <div className="h-screen w-full overflow-hidden">
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
