import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
    return (
        <div className="grid min-h-screen w-full place-content-center">
            <Spinner />
        </div>
    )
}
