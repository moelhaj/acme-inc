"use client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation"

export default function CustomPagination({
  totalPages,
}: {
  totalPages: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const isFirstPage = currentPage <= 1
  const isLastPage = totalPages > 0 ? currentPage >= totalPages : true

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={isFirstPage ? undefined : createPageURL(currentPage - 1)}
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {Array(totalPages)
          .fill(null)
          .map((_, index) => {
            const page = index + 1
            const isCurrentPage = page === currentPage
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={isCurrentPage ? undefined : createPageURL(page)}
                  isActive={isCurrentPage}
                  aria-disabled={isCurrentPage}
                  tabIndex={isCurrentPage ? -1 : undefined}
                  className={isCurrentPage ? "pointer-events-none" : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

        <PaginationItem>
          <PaginationNext
            href={isLastPage ? undefined : createPageURL(currentPage + 1)}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={isLastPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
