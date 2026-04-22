import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getWorkload } from "@/actions/dashboard"
import UserChip from "../user-chip"
import Chip from "../chip"

export default async function Workload() {
    const workload = await getWorkload()
    return (
        <Card className="gap-3">
            <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {workload.map((user) => (
                        <div
                            key={user.id}
                            className="grid grid-cols-7 rounded-md bg-muted/50 p-3 text-xs"
                        >
                            <div className="col-span-4">
                                <UserChip
                                    name={user.name}
                                    avatar={user.avatar}
                                    title={user.title}
                                />
                            </div>
                            <div className="flex items-center justify-center text-xs">
                                {user.tasksCount}
                            </div>
                            <Chip
                                className="col-span-2"
                                color={
                                    user.overloaded ? "destructive" : "primary"
                                }
                            >
                                {user.overloaded ? "Overloaded" : "Balanced"}
                            </Chip>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
