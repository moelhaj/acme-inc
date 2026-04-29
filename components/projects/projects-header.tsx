"use client"
import SearchInput from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ModifyProject from "./modify-project"

export default function ProjectsHeader() {
    const [openCreateSheet, setOpenCreateSheet] = useState(false)
    return (
        <div className="flex items-center justify-between">
            <SearchInput />
            <Button onClick={() => setOpenCreateSheet(true)}>
                Create Project
            </Button>
            <ModifyProject
                open={openCreateSheet}
                setOpen={setOpenCreateSheet}
            />
        </div>
    )
}
