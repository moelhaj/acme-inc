import { getWorkload } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Chip from "../chip"
import UserChip from "../user-chip"

export default async function Workload() {
  const workload = await getWorkload()
  return (
    <Card className="gap-6">
      <CardHeader>
        <CardTitle>Workload Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workload.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-7 rounded-lg bg-muted/70 p-3 text-xs"
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
                color={user.overloaded ? "destructive" : "primary"}
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
