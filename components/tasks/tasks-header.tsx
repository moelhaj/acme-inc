import SearchFilter from "@/components/search-filter"
import SearchInput from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AiInsights from "./ai-insights"
import ModifyTask from "./modify-task"

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

export default function TasksHeader({ projectId }: { projectId: string }) {
    const [openCreateSheet, setOpenCreateSheet] = useState(false)
    return (
        <header className="flex items-center gap-3 px-1">
            <div className="flex items-center gap-3">
                <SearchInput />
                <SearchFilter
                    options={priorityOptions}
                    param="priority"
                    label="Priority"
                />
                <SearchFilter options={typeOptions} param="type" label="Type" />
            </div>
            <div className="ml-auto flex items-center gap-2">
                {/* <AiInsights /> */}
                <Button onClick={() => setOpenCreateSheet(true)}>
                    Create Task
                </Button>
                <ModifyTask
                    open={openCreateSheet}
                    setOpen={setOpenCreateSheet}
                    projectId={projectId}
                />
            </div>
        </header>
    )
}
