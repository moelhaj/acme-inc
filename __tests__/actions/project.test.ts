jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("@/lib/auth", () => ({
  getSession: jest.fn(),
  isAuthenticated: jest.fn().mockResolvedValue(undefined),
}))

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
  getProjects,
  getProjectsTitles,
  createProject,
  updateProject,
  deleteProject,
} from "@/actions/project"

const mockFindMany = jest.mocked(prisma.project.findMany)
const mockCreate = jest.mocked(prisma.project.create)
const mockUpdate = jest.mocked(prisma.project.update)
const mockDelete = jest.mocked(prisma.project.delete)
const mockRevalidatePath = jest.mocked(revalidatePath)

function makeFormData(data: Record<string, string | string[]>): FormData {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => fd.append(k, item))
    else fd.append(k, v)
  })
  return fd
}

const mockProject = {
  id: "proj-1",
  title: "Acme App",
  description: "Main app project",
  dueDate: "2025-12-31",
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
}

describe("getProjects", () => {
  it("returns projects matching the query", async () => {
    mockFindMany.mockResolvedValue([mockProject] as any)
    const result = await getProjects("Acme")
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { title: { contains: "Acme", mode: "insensitive" } },
      })
    )
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Acme App")
  })

  it("throws when the database query fails", async () => {
    mockFindMany.mockRejectedValue(new Error("DB error"))
    await expect(getProjects("")).rejects.toThrow("Failed to fetch projects.")
  })
})

describe("getProjectsTitles", () => {
  it("returns id and title for each project", async () => {
    mockFindMany.mockResolvedValue([{ id: "proj-1", title: "Acme App" }] as any)
    const result = await getProjectsTitles()
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ select: { id: true, title: true } })
    )
    expect(result[0]).toEqual({ id: "proj-1", title: "Acme App" })
  })

  it("throws when the database query fails", async () => {
    mockFindMany.mockRejectedValue(new Error("DB error"))
    await expect(getProjectsTitles()).rejects.toThrow(
      "Failed to fetch project titles."
    )
  })
})

describe("createProject", () => {
  it("returns validation errors when title is missing", async () => {
    const fd = makeFormData({
      description: "A description",
      dueDate: "2025-12-31",
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
    expect(result.errors?.title).toBeDefined()
  })

  it("returns validation error when title exceeds 20 characters", async () => {
    const fd = makeFormData({
      title: "This title is way too long for validation",
      description: "Valid desc",
      dueDate: "2025-12-31",
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
    expect(result.errors?.title).toBeDefined()
  })

  it("returns validation error when dueDate is invalid", async () => {
    const fd = makeFormData({
      title: "Valid Title",
      description: "Valid desc",
      dueDate: "not-a-date",
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
    expect(result.errors?.dueDate).toBeDefined()
  })

  it("creates project and returns success", async () => {
    mockCreate.mockResolvedValue(mockProject as any)
    const fd = makeFormData({
      title: "New Project",
      description: "A new project",
      dueDate: "2025-12-31",
      members: ["user-1", "user-2"],
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("success")
    expect(result.message).toBe("Project created successfully!")
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "New Project",
          members: { connect: [{ id: "user-1" }, { id: "user-2" }] },
        }),
      })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith("/projects")
  })

  it("creates project without members", async () => {
    mockCreate.mockResolvedValue(mockProject as any)
    const fd = makeFormData({
      title: "Solo Project",
      description: "No team",
      dueDate: "2025-12-31",
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("success")
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ members: { connect: [] } }),
      })
    )
  })

  it("returns error on database failure", async () => {
    mockCreate.mockRejectedValue(new Error("DB error"))
    const fd = makeFormData({
      title: "New Project",
      description: "A new project",
      dueDate: "2025-12-31",
    })
    const result = await createProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
    expect(result.message).toBe("Failed to create project.")
  })
})

describe("updateProject", () => {
  it("returns validation error when id is missing", async () => {
    const fd = makeFormData({
      title: "Updated",
      description: "Updated desc",
      dueDate: "2025-12-31",
    })
    const result = await updateProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
  })

  it("updates project and returns success with fields", async () => {
    mockUpdate.mockResolvedValue(mockProject as any)
    const fd = makeFormData({
      id: "proj-1",
      title: "Updated Title",
      description: "Updated desc",
      dueDate: "2025-12-31",
      members: ["user-1"],
    })
    const result = await updateProject({ status: "idle" }, fd)
    expect(result.status).toBe("success")
    expect(result.message).toBe("Project updated successfully!")
    expect(result.fields?.title).toBe("Updated Title")
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "proj-1" },
        data: expect.objectContaining({
          title: "Updated Title",
          members: { set: [{ id: "user-1" }] },
        }),
      })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith("/projects")
  })

  it("returns error on database failure", async () => {
    mockUpdate.mockRejectedValue(new Error("DB error"))
    const fd = makeFormData({
      id: "proj-1",
      title: "Updated",
      description: "Updated desc",
      dueDate: "2025-12-31",
    })
    const result = await updateProject({ status: "idle" }, fd)
    expect(result.status).toBe("error")
    expect(result.message).toBe("Failed to update project.")
  })
})

describe("deleteProject", () => {
  it("deletes the project and revalidates path", async () => {
    mockDelete.mockResolvedValue(mockProject as any)
    await deleteProject("proj-1")
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "proj-1" } })
    expect(mockRevalidatePath).toHaveBeenCalledWith("/projects")
  })

  it("throws when the delete fails", async () => {
    mockDelete.mockRejectedValue(new Error("DB error"))
    await expect(deleteProject("proj-1")).rejects.toThrow(
      "Failed to delete project."
    )
  })
})
