"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type PinnedProject = {
	id: string;
	title: string;
	url?: string;
	order: number;
};

type AppContextType = {
	pinnedProjects: PinnedProject[];
	pinProject: (project: PinnedProject) => void;
	unpinProject: (projectId: string) => void;
	isProjectPinned: (projectId: string) => boolean;
};

const STORAGE_KEY = "acme:pinned-projects";
export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [pinnedProjects, setPinnedProjects] = useState<PinnedProject[]>([]);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			setPinnedProjects(stored ? JSON.parse(stored) : []);
		} catch {
			setPinnedProjects([]);
		}
	}, []);

	function pinProject(project: PinnedProject) {
		setPinnedProjects(prev => {
			if (prev.find(p => p.id === project.id)) return prev;
			const next = [...prev, project];
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {
				// Ignore storage failures (private mode, quota, etc.)
			}
			return next;
		});
	}

	function unpinProject(projectId: string) {
		setPinnedProjects(prev => {
			const next = prev.filter(p => p.id !== projectId);
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {
				// Ignore storage failures (private mode, quota, etc.)
			}
			return next;
		});
	}

	function isProjectPinned(projectId: string) {
		return pinnedProjects.some(p => p.id === projectId);
	}
	return (
		<AppContext.Provider
			value={{
				pinnedProjects,
				pinProject,
				unpinProject,
				isProjectPinned,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default function useApp(): AppContextType {
	const ctx = useContext(AppContext);
	if (!ctx) {
		throw new Error("useApp must be used within AppProvider");
	}
	return ctx;
}
