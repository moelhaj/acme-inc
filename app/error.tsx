"use client";
import { useEffect } from "react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { SettingError03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="flex h-svh flex-col items-center justify-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<HugeiconsIcon
							icon={SettingError03Icon}
							size={36}
							color="currentColor"
							strokeWidth={1.5}
						/>
					</EmptyMedia>
					<EmptyTitle>Something went wrong!</EmptyTitle>
					<EmptyDescription>
						An unexpected error has occurred. Please try again.
					</EmptyDescription>
					<EmptyDescription>Error details: {error.message}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent className="flex-row justify-center gap-2">
					<Button onClick={() => reset()}>Try again</Button>
				</EmptyContent>
			</Empty>
		</main>
	);
}
