import { Spinner } from "./ui/spinner"

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  )
}
