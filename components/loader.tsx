import { Spinner } from "@/components/ui/spinner"

export default function Loader() {
  return (
    <div className="grid h-full w-full place-content-center">
      <Spinner />
    </div>
  )
}
