"use client"
import { getUsers } from "@/actions/user"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userInitials } from "@/lib/utils"
import { User } from "@/prisma/generated/prisma/client"

type SelectUsersProps =
  | {
      multiple: true
      selectedUsers: string[]
      setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>
    }
  | {
      multiple?: false
      selectedUsers: string
      setSelectedUsers: React.Dispatch<React.SetStateAction<string>>
    }

export function SelectUsers(props: SelectUsersProps) {
  const { multiple, selectedUsers, setSelectedUsers } = props
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then(setAllUsers)
      .catch((error) => {
        throw new Error(`Failed to fetch users: ${error.message}`)
      })
      .finally(() => setLoading(false))
  }, [])

  function toggleUser(id: string) {
    if (multiple) {
      ;(setSelectedUsers as React.Dispatch<React.SetStateAction<string[]>>)(
        (prev) =>
          prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      )
    } else {
      ;(setSelectedUsers as React.Dispatch<React.SetStateAction<string>>)(id)
      setOpen(false)
    }
  }

  function getLabel() {
    if (multiple) {
      return (selectedUsers as string[]).length > 0
        ? `${(selectedUsers as string[]).length} selected`
        : "Select members"
    }
    const user = allUsers.find((u) => u.id === selectedUsers)
    return user ? user.name : "Select member"
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-transparent font-normal"
        >
          <span className="flex items-center gap-2">{getLabel()}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {loading ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Loading users...
          </div>
        ) : allUsers.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No users found
          </div>
        ) : multiple ? (
          allUsers.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.id}
              checked={(selectedUsers as string[]).includes(user.id)}
              onCheckedChange={() => toggleUser(user.id)}
              onSelect={(e) => e.preventDefault()}
            >
              <UserItem user={user} />
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuRadioGroup
            value={selectedUsers as string}
            onValueChange={toggleUser}
          >
            {allUsers.map((user) => (
              <DropdownMenuRadioItem key={user.id} value={user.id}>
                <UserItem user={user} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserItem({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="flex h-8 w-8 items-center justify-center">
        <AvatarImage
          src={`/${user.avatar}`}
          alt={user.name}
          className="h-6 w-6 rounded-full object-contain"
        />
        <AvatarFallback>{userInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span>{user.name}</span>
        {user.title && (
          <span className="text-xs text-muted-foreground">{user.title}</span>
        )}
      </div>
    </div>
  )
}
