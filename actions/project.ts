"use server"
import prisma from "@/lib/prisma"
import { ProjectSchema } from "@/lib/schema"
import { revalidatePath } from "next/cache"
import { State } from "@/lib/definitions"

export type ProjectState = State & {
    fields?: {
        title: string
        description: string
    }
    errors?: {
        title?: string[]
        description?: string[]
    }
}

const ModifyProject = ProjectSchema.omit({ id: true })

export async function getProjects(query: string) {
    try {
        const projects = await prisma.project.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return projects
    } catch (error) {
        throw new Error("Failed to fetch projects.")
    }
}

export async function getProjectById(id: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id },
        })
        return project
    } catch (error) {
        throw new Error("Failed to fetch project.")
    }
}

export async function getProjectsTitles() {
    try {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return projects
    } catch (error) {
        throw new Error("Failed to fetch project titles.")
    }
}

export async function createProject(prevState: State, formData: FormData) {
    const validatedFields = ModifyProject.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to create project.",
            fields: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
            },
            status: "error",
        }
    }

    const { title, description } = validatedFields.data
    try {
        await prisma.project.create({
            data: {
                title,
                description,
            },
        })
        revalidatePath("/projects")
        return { message: "Project created successfully!", status: "success" }
    } catch (error) {
        throw new Error("Failed to fetch projects.")
    }
}

export async function updateProject(prevState: State, formData: FormData) {
    const validatedFields = ProjectSchema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update project.",
            fields: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
            },
            status: "error",
        }
    }

    const { id, title, description } = validatedFields.data
    try {
        await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
            },
        })
        revalidatePath("/projects")
        return {
            message: "Project updated successfully!",
            status: "success",
            fields: {
                title,
                description,
            },
        }
    } catch (error) {
        throw new Error("Failed to update project.")
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({
            where: { id },
        })
    } catch (error) {
        return { message: "Failed to delete project.", error }
    }
    revalidatePath("/projects")
}
