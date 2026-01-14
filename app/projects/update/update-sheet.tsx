"use client";

import { Project } from "@/lib/definitions";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import UpdateProjectForm from "./update-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateProjectSheet({ project }: { project: Project }) {
	const router = useRouter();
	const [open, setOpen] = useState(true);

	return (
		<Sheet
			open={open}
			onOpenChange={isOpen => {
				setOpen(isOpen);
				if (!isOpen) {
					router.back();
				}
			}}
		>
			<SheetContent
				side="right"
				onPointerDownOutside={event => event.preventDefault()}
				className="gap-0"
			>
				<SheetHeader className="pb-0">
					<SheetTitle>Update project</SheetTitle>
					<SheetDescription>Update the project details below.</SheetDescription>
				</SheetHeader>
				<div className="px-4 py-4 h-full">
					<UpdateProjectForm
						project={project}
						onCancel={() => router.back()}
						onSuccess={() => {
							setOpen(false);
							router.replace("/projects");
						}}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
