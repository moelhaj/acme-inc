"use client"
import SearchInput from "../search-input"
import CreateProject from "./create-project"

export default function ProjectsHeader() {
    return (
        <div className="flex w-full items-center justify-between px-4 pt-4">
            <SearchInput />
            <CreateProject />
        </div>
    )
}
