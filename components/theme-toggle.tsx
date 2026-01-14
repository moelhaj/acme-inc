"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme();

	const handleThemeToggle = useCallback(
		(e?: React.MouseEvent) => {
			const newMode = resolvedTheme === "dark" ? "light" : "dark";
			const root = document.documentElement;

			if (!document.startViewTransition) {
				setTheme(newMode);
				return;
			}
			if (e) {
				root.style.setProperty("--x", `${e.clientX}px`);
				root.style.setProperty("--y", `${e.clientY}px`);
			}

			document.startViewTransition(() => {
				setTheme(newMode);
			});
		},
		[resolvedTheme, setTheme]
	);

	return (
		<DropdownMenuItem onClick={handleThemeToggle}>
			{resolvedTheme === "dark" ? <Sun /> : <Moon />}
			Theme
		</DropdownMenuItem>
	);
}
