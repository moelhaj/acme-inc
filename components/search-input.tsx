"use client"
import { Input } from "@/components/ui/input"
import {
  Cancel01Icon,
  Loading03Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleClearInput = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("query")
    setIsLoading(true)
    replace(`${pathname}?${params.toString()}`)
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (searchParams.get("query")?.toString()) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <div className="relative">
      <Input
        id="search-input"
        ref={inputRef}
        className="peer ps-9 pe-12 md:max-w-60"
        placeholder="Search..."
        type="search"
        onChange={(e) => {
          setIsLoading(true)
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        {isLoading ? (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            size={15}
            className="animate-spin"
          />
        ) : (
          <HugeiconsIcon icon={Search02Icon} strokeWidth={2} size={15} />
        )}
      </div>
      {searchParams.get("query")?.toString() && (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear input"
          onClick={handleClearInput}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={15} />
        </button>
      )}
    </div>
  )
}
