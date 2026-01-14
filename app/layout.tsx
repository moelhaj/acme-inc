import { AppProvider } from "@/hooks/use-app";
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: {
		template: "%s | Acme-Inc",
		default: "Acme-Inc",
	},
	description: "Project management for developers",
	metadataBase: new URL("https://acme-inc-zeta.vercel.app"),
	keywords: ["Next.js", "React", "Tailwind CSS", "Server Components", "Shadcn", "AI Integration"],
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
		url: "https://moelhaj.github.io/",
		title: "Acme-Inc",
		description: "Project management for developers",
		siteName: "Acme-Inc",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={inter.className} lang="en" suppressHydrationWarning>
			<body className="antialiased text-sm" suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<TooltipProvider delayDuration={0}>
						<AppProvider>
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<Header />
									{children}
								</SidebarInset>
							</SidebarProvider>
						</AppProvider>
						<Toaster position="top-right" richColors duration={3000} closeButton />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
