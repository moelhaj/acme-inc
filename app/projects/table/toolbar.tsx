"use client";
import { Input } from "@/components/ui/input";
import { Priorities, Statuses } from "@/lib/definitions";
import { CircleXIcon, LoaderCircleIcon, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CreateProject } from "../components/create-project";
import { FacetedFilter } from "./filter";

export default function Toolbar() {
	const inputRef = useRef<HTMLInputElement>(null);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSearch = useDebouncedCallback(term => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	const handleClearInput = () => {
		const params = new URLSearchParams(searchParams);
		params.delete("query");
		setIsLoading(true);
		replace(`${pathname}?${params.toString()}`);
		if (inputRef.current) {
			inputRef.current.value = "";
			inputRef.current.focus();
		}
	};

	useEffect(() => {
		if (searchParams.get("query")?.toString()) {
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	return (
		<div className="flex items-center gap-4">
			<div className="relative">
				<Input
					id="search-input"
					ref={inputRef}
					className="peer ps-9 pe-12"
					placeholder="Search..."
					type="search"
					onChange={e => {
						setIsLoading(true);
						handleSearch(e.target.value);
					}}
					defaultValue={searchParams.get("query")?.toString()}
				/>
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					{isLoading ? (
						<LoaderCircleIcon
							className="animate-spin"
							size={16}
							role="status"
							aria-label="Loading..."
						/>
					) : (
						<SearchIcon size={16} aria-hidden="true" />
					)}
				</div>
				{searchParams.get("query")?.toString() && (
					<button
						className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Clear input"
						onClick={handleClearInput}
					>
						<CircleXIcon size={16} aria-hidden="true" />
					</button>
				)}
			</div>
			<div className="flex flex-1 lg:hidden" />
			<div className="flex items-center gap-2 flex-1">
				<FacetedFilter options={Statuses} label="Status" />
				<FacetedFilter options={Priorities} label="Priority" />
				<div className="flex-1 hidden lg:flex" />
				<CreateProject />
			</div>
		</div>
	);
}
