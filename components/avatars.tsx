import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar"
import { userInitials } from "@/lib/utils"

export default function Avatars({
    members,
}: {
    members: { id: string; name: string; avatar: string }[]
}) {
    return (
        <div className="flex items-center gap-1 space-x-2 text-xs text-muted-foreground">
            <AvatarGroup>
                {members.slice(0, 3).map((member) => (
                    <Avatar
                        key={member.id}
                        className="flex h-8 w-8 items-center justify-center"
                    >
                        <AvatarImage
                            src={member.avatar}
                            alt={member.name}
                            className="h-6 w-6 object-contain"
                        />
                        <AvatarFallback>
                            {userInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {members.length > 3 && (
                    <AvatarGroupCount>+{members.length - 3}</AvatarGroupCount>
                )}
            </AvatarGroup>
        </div>
    )
}
