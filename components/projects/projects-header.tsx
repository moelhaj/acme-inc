"use client"
import SearchInput from "@/components/form/search-input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ProjectForm from "./project-form"

export default function ProjectsHeader() {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <SearchInput />
      <Button onClick={() => setOpenCreateModal(true)}>Create Project</Button>
      <ProjectForm open={openCreateModal} setOpen={setOpenCreateModal} />
    </div>
  )
}
