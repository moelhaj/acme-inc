import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="grid h-svh w-full place-content-center gap-4 text-center">
      <div className="space-x-2">
        <span className="font-medium">404</span>
        <span>|</span>
        <span className="text-sm">This page could not be found</span>
      </div>
      <Button variant="secondary" asChild className="m-auto w-fit">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 select-none"
        >
          Back
        </Link>
      </Button>
    </div>
  )
}
