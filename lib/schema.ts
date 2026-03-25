import { z } from "zod"

export const ProjectSchema = z.object({
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
})

export const TaskSchema = z.object({
    id: z.string(),
    title: z
        .string()
        .min(1, "Title is required")
        .max(50, "Title must be at most 100 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description must be at most 100 characters"),
    projectId: z.string().min(1).max(50),
    userId: z.string().uuid({ message: "Assignee is required" }),
    status: z.enum(["todo", "in_progress", "done"], {
        error: "Status is required",
    }),
    priority: z.enum(["low", "medium", "high"], {
        error: "Priority is required",
    }),
    type: z.enum(["feature", "bug", "improvement"], {
        error: "Type is required",
    }),
})
