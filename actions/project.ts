"use server"
import { isAuthenticated } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export type State = {
    message?: string | null
    status: string
    error?: unknown
    fields?: {
        title: string
        description: string
        dueDate: string
        members: string[]
    }
    errors?: {
        title?: string[]
        description?: string[]
        dueDate?: string[]
        members?: string[]
    }
}

const ProjectSchema = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required." }).max(20, {
        message: "Title must be at most 20 characters.",
    }),
    description: z
        .string()
        .min(1, { message: "Description is required." })
        .max(50, {
            message: "Description must be at most 50 characters.",
        }),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Due date must be a valid date.",
    }),
    members: z.array(z.string()).optional(),
})

const ModifyProject = ProjectSchema.omit({ id: true })

export async function fetchProjects(query: string) {
    await isAuthenticated()
    try {
        const projects = await prisma.project.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            include: {
                members: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return projects
    } catch (error) {
        throw new Error("Failed to fetch projects.")
    }
}

export async function fetchProjectsTitles() {
    await isAuthenticated()
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
        throw new Error("Failed to fetch project titles")
    }
}

export async function createProject(
    prevState: State,
    formData: FormData
): Promise<State> {
    await isAuthenticated()
    const rawProject = {
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        members: formData
            .getAll("members")
            .filter((v): v is string => typeof v === "string"),
    }
    const validatedFields = ModifyProject.safeParse(rawProject)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to create project.",
            fields: {
                title:
                    typeof rawProject.title === "string"
                        ? rawProject.title
                        : "",
                description:
                    typeof rawProject.description === "string"
                        ? rawProject.description
                        : "",
                dueDate:
                    typeof rawProject.dueDate === "string"
                        ? rawProject.dueDate
                        : "",
                members: rawProject.members,
            },
            status: "error",
        }
    }

    const { title, description, dueDate, members } = validatedFields.data
    try {
        await prisma.project.create({
            data: {
                title,
                description,
                dueDate,
                members: {
                    connect: (members ?? []).map((id) => ({ id })),
                },
            },
        })
        revalidatePath("/projects")
        return { message: "Project created successfully!", status: "success" }
    } catch (error) {
        throw new Error("Failed to create project.")
    }
}

export async function updateProject(
    prevState: State,
    formData: FormData
): Promise<State> {
    await isAuthenticated()
    const rawProject = {
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        members: formData
            .getAll("members")
            .filter((v): v is string => typeof v === "string"),
    }
    const validatedFields = ProjectSchema.safeParse(rawProject)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update project.",
            fields: {
                title:
                    typeof rawProject.title === "string"
                        ? rawProject.title
                        : "",
                description:
                    typeof rawProject.description === "string"
                        ? rawProject.description
                        : "",
                dueDate:
                    typeof rawProject.dueDate === "string"
                        ? rawProject.dueDate
                        : "",
                members: rawProject.members,
            },
            status: "error",
        }
    }

    const { id, title, description, dueDate, members } = validatedFields.data
    try {
        await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                dueDate,
                members: {
                    set: (members ?? []).map((id) => ({ id })),
                },
            },
        })
        revalidatePath("/projects")
        return {
            message: "Project updated successfully!",
            status: "success",
            fields: {
                title,
                description,
                dueDate,
                members: members ?? [],
            },
        }
    } catch (error) {
        throw new Error("Failed to update project.")
    }
}

export async function deleteProject(id: string) {
    await isAuthenticated()
    try {
        await prisma.project.delete({
            where: { id },
        })
    } catch (error) {
        throw new Error("Failed to delete project.")
    }
    revalidatePath("/projects")
}
