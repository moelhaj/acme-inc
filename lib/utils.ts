import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generatePagination(currentPage: number, totalPages: number) {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, "...", totalPages - 1, totalPages];
	}

	if (currentPage >= totalPages - 2) {
		return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
	}

	return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function resolveAvatarSrc(value?: string | null) {
	if (!value) return "";
	if (value.startsWith("http") || value.startsWith("/")) return value;
	return `/${value}`;
}
