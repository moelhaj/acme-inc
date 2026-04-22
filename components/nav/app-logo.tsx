import { AiBrain05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Fragment } from "react/jsx-runtime"

export function AppLogo() {
    return (
        <Fragment>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <HugeiconsIcon
                    icon={AiBrain05Icon}
                    strokeWidth={2}
                    className="size-4"
                />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
            </div>
        </Fragment>
    )
}
