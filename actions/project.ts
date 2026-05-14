"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type ProjectPayload = {
  title: string
  description: string
  dueDate: Date
  members?: string[] | undefined
}

const ROWS_PER_PAGE = 10

export async function fetchProjects(query: string, page: number) {
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
      skip: (page - 1) * ROWS_PER_PAGE,
      take: ROWS_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    })
    const projectsCount = await prisma.project.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    })
    const totalPages = Math.ceil(projectsCount / ROWS_PER_PAGE)
    return { projects, totalPages }
  } catch (error) {
    throw new Error("Failed to fetch projects.")
  }
}

export async function fetchProjectsTitles() {
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

export async function createProject(data: ProjectPayload) {
  try {
    await prisma.project.create({
      data: {
        ...data,
        members: {
          connect: (data.members ?? []).map((id) => ({ id })),
        },
      },
    })
    revalidatePath("/projects")
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create project.")
  }
}

export async function updateProject(id: string, data: ProjectPayload) {
  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...data,
        members: {
          set: (data.members ?? []).map((id) => ({ id })),
        },
      },
    })
    revalidatePath("/projects")
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
    throw new Error("Failed to delete project.")
  }
  revalidatePath("/projects")
}
