import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userInitials } from "@/lib/utils"

type Props = {
    name: string
    avatar: string
    title: string
}

export default function UserChip({ name, avatar, title }: Props) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="size-7 rounded-md bg-muted p-1">
                <AvatarImage
                    src={avatar}
                    alt={name}
                    className="h-6 w-6 rounded-full object-contain"
                />
                <AvatarFallback>{userInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-xs font-semibold">{name}</span>
                <span className="text-[11px] text-muted-foreground">
                    {title}
                </span>
            </div>
        </div>
    )
}
