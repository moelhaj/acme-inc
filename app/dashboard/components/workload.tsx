import { Badge } from "@/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

type WorkloadProps = {
    workload: Array<{
        id: string
        name: string
        title: string
        avatar: string
        tasksCount: number
        overloaded: boolean
    }>
}

export default function Workload({ workload }: WorkloadProps) {
    return (
        <Card className="gap-3">
            <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="w-full">
                    <TableBody>
                        {workload.slice(0, 5).map((user) => (
                            <TableRow
                                key={user.id}
                                className="rounded-xl border-0"
                            >
                                <TableCell className="rounded-l-xl py-3">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-7 rounded-md bg-muted p-1">
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-6 w-6 rounded-full object-contain"
                                            />
                                            <AvatarFallback>
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">
                                                {user.name}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {user.title}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-full py-3">
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={user.tasksCount}
                                            className="h-1.5 flex-1"
                                        />
                                        <div className="grid w-8 place-content-center rounded-md bg-muted p-1 text-xs">
                                            {user.tasksCount}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="rounded-r-xl py-3">
                                    <div className="flex h-full w-[100px] items-center justify-center">
                                        {user.overloaded ? (
                                            <Badge className="bg-rose-200 text-rose-800 dark:bg-rose-400 dark:text-rose-900">
                                                Overloaded
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-green-200 text-green-800 dark:bg-green-400 dark:text-green-900">
                                                Balanced
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
