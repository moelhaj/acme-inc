import { cn } from "@/lib/utils";

type AiButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
};

export function AiButton({ children, onClick, className }: AiButtonProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"relative inline-flex items-center justify-center rounded-full p-[2px]",
				"bg-[length:300%_300%] bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-violet-500",
				"animate-[gradient-border_4s_ease_infinite]",
				"hover:scale-[1.02] transition-transform",
				className,
			)}
		>
			{/* Glow */}
			<span
				aria-hidden
				className="absolute inset-0 rounded-full blur-md opacity-60
                   bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-violet-500"
			/>

			{/* Actual button */}
			<span
				className="relative z-10 inline-flex items-center gap-2
                   rounded-[10px] bg-background px-4 py-2
                   text-sm font-medium text-foreground"
			>
				{children}
			</span>
		</button>
	);
}
