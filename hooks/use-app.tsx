"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type PinnedProject = {
	id: string;
	title: string;
	url?: string;
	order: number;
};

type AppContextType = {
	isSettingOpen: boolean;
	setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
	pinnedProjects: PinnedProject[];
	pinProject: (project: PinnedProject) => void;
	unpinProject: (projectId: string) => void;
	isProjectPinned: (projectId: string) => boolean;
};

const STORAGE_KEY = "acme:pinned-projects";
export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [isSettingOpen, setIsSettingOpen] = useState(false);
	const [pinnedProjects, setPinnedProjects] = useState<PinnedProject[]>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});

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
				isSettingOpen,
				setIsSettingOpen,
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
