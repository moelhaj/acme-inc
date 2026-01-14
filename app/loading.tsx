import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<div className="w-full h-full grid place-content-center">
			<Spinner />
		</div>
	);
}
