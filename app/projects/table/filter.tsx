import { Check, PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
	options: { value: string; label: string }[];
	label: string;
};

export function FacetedFilter({ options, label }: Props) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const paramKey = label.toLowerCase();
	const selectedValues = useMemo(() => {
		const current = searchParams.get(paramKey);
		if (!current) {
			return new Set<string>();
		}
		return new Set(current.split(",").filter(Boolean));
	}, [searchParams, paramKey]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8">
					<PlusCircle />
					{label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
				<Command>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map(option => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											const newValues = new Set(selectedValues);
											if (isSelected) {
												newValues.delete(option.value);
											} else {
												newValues.add(option.value);
											}
											const params = new URLSearchParams(searchParams);
											params.set("page", "1");
											if (newValues.size > 0) {
												params.set(
													paramKey,
													Array.from(newValues).join(","),
												);
											} else {
												params.delete(paramKey);
											}
											router.push(`${pathname}?${params.toString()}`);
										}}
									>
										<div
											className={cn(
												"flex size-4 items-center justify-center rounded-[4px] border",
												isSelected
													? "bg-primary border-primary text-primary-foreground"
													: "border-input [&_svg]:invisible",
											)}
										>
											<Check className="text-primary-foreground size-3.5" />
										</div>
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											const params = new URLSearchParams(searchParams);
											params.set("page", "1");
											params.delete(paramKey);
											router.push(`${pathname}?${params.toString()}`);
										}}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
