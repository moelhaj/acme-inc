import {
  Bug01Icon,
  CheckmarkCircle02Icon,
  DashedLineCircleIcon,
  CircleArrowOutUpRightIcon,
  CircleIcon,
  DrawingModeIcon,
  BulbChargingIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function TaskPriority({ taskPriority }: { taskPriority: string }) {
  switch (taskPriority) {
    case "low":
      return (
        <TaskItem value={taskPriority}>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </TaskItem>
      )
    case "medium":
      return (
        <TaskItem value={taskPriority}>
          <span className="h-1.5 w-1.5 rounded-full bg-warning" />
        </TaskItem>
      )
    case "high":
      return (
        <TaskItem value={taskPriority}>
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        </TaskItem>
      )
    default:
      return null
  }
}

export function TaskType({ taskType }: { taskType: string }) {
  switch (taskType) {
    case "bug":
      return (
        <TaskItem value={taskType}>
          <HugeiconsIcon
            icon={Bug01Icon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    case "feature":
      return (
        <TaskItem value={taskType}>
          <HugeiconsIcon
            icon={DrawingModeIcon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    case "improvement":
      return (
        <TaskItem value={taskType}>
          <HugeiconsIcon
            icon={BulbChargingIcon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    default:
      return null
  }
}

export function TaskStatus({ taskStatus }: { taskStatus: string }) {
  switch (taskStatus) {
    case "todo":
      return (
        <TaskItem value={taskStatus}>
          <HugeiconsIcon
            icon={CircleIcon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    case "in_progress":
      return (
        <TaskItem value={taskStatus}>
          <HugeiconsIcon
            icon={DashedLineCircleIcon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    case "in_review":
      return (
        <TaskItem value={taskStatus}>
          <HugeiconsIcon
            icon={CircleArrowOutUpRightIcon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    case "done":
      return (
        <TaskItem value={taskStatus}>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={12}
            color="currentColor"
            strokeWidth={2}
          />
        </TaskItem>
      )
    default:
      return null
  }
}

function TaskItem({
  value,
  children,
}: {
  value: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex w-fit items-center gap-2 rounded-sm bg-muted px-2 py-1 text-xs font-medium">
      {children}
      <span className="capitalize">
        {value.replace(/_/g, " ").toLowerCase()}
      </span>
    </div>
  )
}
