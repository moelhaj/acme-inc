"use client";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bot, SquaresExclude } from "lucide-react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { AiButton } from "@/components/ui/ai-button";

export function Header() {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(segment => segment !== "");

	const breadcrumbItems = pathSegments.map((segment, index) => {
		const href = "/" + pathSegments.slice(0, index + 1).join("/");
		const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Basic capitalization

		return (
			<BreadcrumbItem key={href}>
				<BreadcrumbLink asChild>
					<Link href={href}>{label}</Link>
				</BreadcrumbLink>
			</BreadcrumbItem>
		);
	});
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
			<div className="flex items-center gap-2 px-4 w-full">
				<SidebarTrigger className="-ml-1" />
				<div className="flex-1 flex md:hidden" />
				<Separator
					orientation="vertical"
					className="hidden md:flex mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb className="hidden md:flex">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{pathSegments.length > 0 && <BreadcrumbSeparator />}
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={`breadcrumb-${index}`}>
								{item}
								{index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="flex-1 md:flex hidden" />
				<AiButton onClick={() => console.log("AI Assist")}>
					<Sparkles className="h-4 w-4 text-cyan-400" />
					AI Assist
				</AiButton>
			</div>
		</header>
	);
}
