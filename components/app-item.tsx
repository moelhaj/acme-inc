"use client"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SettingError03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Activity, Fragment } from "react"

type AppItemProps = {
  emptyTitle: string
  emptyLabel: string
  hide: boolean
  show: boolean
  children: React.ReactNode
}

export default function AppItem({
  emptyTitle,
  emptyLabel,
  hide,
  show,
  children,
}: AppItemProps) {
  return (
    <Fragment>
      <Activity mode={hide ? "visible" : "hidden"}>
        <div className="flex h-[calc(100svh-11rem)] flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-muted">
                <HugeiconsIcon
                  icon={SettingError03Icon}
                  size={36}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </EmptyMedia>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{`Tip: If you didn't create any ${emptyLabel} yet, you can start by creating a new one. If you are searching for a specific ${emptyLabel}, try adjusting your search or filter criteria.`}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </Activity>
      <Activity mode={show ? "visible" : "hidden"}>{children}</Activity>
    </Fragment>
  )
}
