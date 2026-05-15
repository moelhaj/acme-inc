"use client"
import { Input } from "@/components/ui/input"
import { useRef } from "react"
import { useDebouncedCallback } from "use-debounce"

const DEBOUNCE_MS = 300

export default function SearchTasks({
  onSearch,
}: {
  onSearch: (term: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch(term)
  }, DEBOUNCE_MS)

  return (
    <div className="relative w-full max-w-42 md:max-w-60">
      <Input
        id="search-input"
        ref={inputRef}
        className="peer h-8 rounded-lg ps-3 pe-12"
        placeholder="Search..."
        type="search"
        onChange={(e) => {
          handleSearch(e.target.value.trim())
        }}
      />
    </div>
  )
}
