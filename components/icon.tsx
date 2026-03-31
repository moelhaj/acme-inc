import { IconSvgObject } from "@/lib/definitions"
import { HugeiconsIcon } from "@hugeicons/react"

type IconProps = {
    icon: IconSvgObject
    size?: number
    color?: string
    strokeWidth?: number
    className?: string
}

export default function Icon({
    icon,
    size = 24,
    color = "currentColor",
    strokeWidth = 1.5,
    className,
}: IconProps) {
    return (
        <HugeiconsIcon
            icon={icon}
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
        />
    )
}
