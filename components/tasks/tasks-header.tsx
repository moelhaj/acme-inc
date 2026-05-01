import SearchFilter from "@/components/form/search-filter"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ModifyTask from "./modify-task"
import SearchTasks from "./search-tasks"

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const typeOptions = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
]

export default function TasksHeader({
  projectId,
  onSearch,
}: {
  projectId: string
  onSearch: (term: string) => void
}) {
  const [openCreateSheet, setOpenCreateSheet] = useState(false)
  return (
    <header className="flex items-center gap-3 px-1">
      <div className="flex items-center gap-3">
        <SearchTasks onSearch={onSearch} />
        <SearchFilter
          options={priorityOptions}
          param="priority"
          label="Priority"
        />
        <SearchFilter options={typeOptions} param="type" label="Type" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* <AiInsights /> */}
        <Button onClick={() => setOpenCreateSheet(true)}>Create Task</Button>
        <ModifyTask
          open={openCreateSheet}
          setOpen={setOpenCreateSheet}
          projectId={projectId}
        />
      </div>
    </header>
  )
}
