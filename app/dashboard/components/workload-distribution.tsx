import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type WorkloadUser = {
    userId: string
    name: string
    avatar: string
    active: number
    high: number
    score: number
}

export default function WorkloadDistribution({
    workload,
}: {
    workload: Array<WorkloadUser> | undefined
}) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle>Workload distribution</CardTitle>
            </CardHeader>
            <CardContent className="gap-0">
                {workload &&
                    workload.slice(0, 5).map((user: WorkloadUser) => (
                        <div
                            key={user.userId}
                            className="mb-1 grid grid-cols-9 items-center gap-4 p-2"
                        >
                            <div className="col-span-3 flex items-center gap-2">
                                <Avatar className="size-7 rounded-md bg-muted p-1">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                            </div>
                            <div className="col-span-5 col-start-4 flex items-center gap-2">
                                <Progress
                                    value={user.score}
                                    className="h-1.5 flex-1"
                                />
                                <div className="grid w-8 place-content-center rounded-md bg-muted p-1 text-xs">
                                    {user.score}
                                </div>
                            </div>
                            <div className="col-start-9">
                                {user.high > 0 && (
                                    <div className="ml-auto w-max rounded-md px-2 py-1 text-xs font-medium text-destructive/90">
                                        {user.high} high
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </CardContent>
        </Card>
    )
}
