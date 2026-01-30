import { Header } from "@/components/header";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/hooks/use-app";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Acme-Inc",
		default: "Acme-Inc",
	},
	description: "Project management for developers",
	metadataBase: new URL("https://acme-inc-ashen.vercel.app"),
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
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<TooltipProvider delayDuration={0}>
						<AppProvider>
							<SidebarProvider>
								<SidebarWrapper />
								<SidebarInset>
									<Header />
									{children}
								</SidebarInset>
							</SidebarProvider>
						</AppProvider>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
