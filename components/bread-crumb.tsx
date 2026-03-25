"use client"
import { getProjectById } from "@/actions/project"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"

export function BreadCrumb() {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter((segment) => segment !== "")
    const [projectTitles, setProjectTitles] = useState<Record<string, string>>(
        {}
    )
    const projectId = useMemo(() => {
        const projectsIndex = pathSegments.indexOf("projects")
        if (projectsIndex === -1) return null
        const id = pathSegments[projectsIndex + 1]
        if (!id) return null
        return /^[0-9a-f-]{36}$/i.test(id) ? id : null
    }, [pathSegments])

    useEffect(() => {
        if (!projectId || projectTitles[projectId]) return
        let isMounted = true
        ;(async () => {
            try {
                const project = await getProjectById(projectId)
                if (isMounted && project?.title) {
                    setProjectTitles((prev) => ({
                        ...prev,
                        [projectId]: project.title,
                    }))
                }
            } catch (error) {
                console.error("Failed to load project title", error)
            }
        })()

        return () => {
            isMounted = false
        }
    }, [projectId, projectTitles])

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/")
        const label =
            projectTitles[segment] ??
            segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
            <BreadcrumbItem key={href}>
                <BreadcrumbLink render={<Link href={href}>{label}</Link>} />
            </BreadcrumbItem>
        )
    })

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={`breadcrumb-${index}`}>
                        {item}
                        {index < breadcrumbItems.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
