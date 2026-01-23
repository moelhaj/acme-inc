"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { Issue } from "@/lib/definitions";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
	errors?: {
		title?: string[];
		description?: string[];
		status?: string[];
		priority?: string[];
	};
	message?: string | null;
};

const FormSchema = z.object({
	id: z.string(),
	project_id: z.string(),
	title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be at most 500 characters"),
	type: z.enum(["bug", "feature", "improvement"], {
		message: "Type is required",
	}),
	status: z.enum(["todo", "in_progress", "in_review", "done"], {
		message: "Status is required",
	}),
	priority: z.enum(["low", "medium", "high", "urgent"], {
		message: "Priority is required",
	}),
	position: z.number().min(0),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

const CreateIssue = FormSchema.omit({ id: true, created_at: true, updated_at: true });
const UpdateIssue = FormSchema.omit({ id: true, created_at: true, updated_at: true });

const parseListParam = (value: string) =>
	value
		.split(",")
		.map(item => item.trim())
		.filter(Boolean);

const buildIssueFilters = (projectId: string, type: string, status: string, priority: string) => {
	const filters: ReturnType<typeof sql>[] = [];

	if (projectId) {
		filters.push(sql`issues.project_id = ${projectId}::uuid`);
	}

	const typeValues = parseListParam(type);
	if (typeValues.length > 0) {
		filters.push(sql`issues.type = ANY(${typeValues})`);
	}

	const statusValues = parseListParam(status);
	if (statusValues.length > 0) {
		filters.push(sql`issues.status = ANY(${statusValues})`);
	}

	const priorityValues = parseListParam(priority);
	if (priorityValues.length > 0) {
		filters.push(sql`issues.priority = ANY(${priorityValues})`);
	}

	if (filters.length === 0) {
		return sql``;
	}

	return sql`WHERE ${filters.reduce((acc, filter, i) =>
		i === 0 ? filter : sql`${acc} AND ${filter}`,
	)}`;
};

export async function fetchFilteredIssues(
	projectId: string,
	type: string,
	status: string,
	priority: string,
) {
	try {
		const whereClause = buildIssueFilters(projectId, type, status, priority);
		const issues = await sql<Issue[]>`
      SELECT
        issues.id,
        issues.project_id,
        issues.user_id,
        users.name as user_name,
        users.avatar as user_avatar,
        issues.title,
        issues.description,
        issues.status,
        issues.priority,
        issues.type,
        issues.position,
        issues.created_at,
        issues.updated_at
      FROM issues
      LEFT JOIN users ON users.id = issues.user_id
      ${whereClause}
      ORDER BY issues.position ASC
    `;

		return issues;
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch issues.");
	}
}

export async function createIssue(
	data: Omit<Issue, "id" | "position" | "created_at" | "updated_at">,
) {
	const { title, description, type, status, priority, project_id, user_id } = data;
	try {
		const result = await sql<{ position: number }[]>`
			SELECT MAX(position) as position
			FROM issues
			WHERE project_id = ${project_id}::uuid AND status = ${status}
		`;
		const lastPosition = result[0]?.position ?? -1;
		await sql`
			INSERT INTO issues (title, description, type, status, priority, position, project_id, user_id)
			VALUES (${title}, ${description}, ${type}, ${status}, ${priority}, ${lastPosition + 1}, ${project_id}, ${user_id})
		`;
	} catch (error) {
		return {
			message: "Database error: Failed to create project.",
			error,
		};
	}
	revalidatePath("/projects");
}

export async function updateIssue(
	id: string,
	data: Omit<Issue, "id" | "created_at" | "updated_at">,
) {
	const { title, description, status, priority, type, position, project_id, user_id } = data;

	try {
		await sql`
			UPDATE issues
			SET title = ${title},
			description = ${description},
			status = ${status},
			priority = ${priority},
			type = ${type},
			position = ${position},
			project_id = ${project_id},
			user_id = ${user_id ?? null},
			updated_at = NOW()
			WHERE id = ${id}
		`;
	} catch (error) {
		return { message: "Database error: Failed to update project.", error };
	}

	revalidatePath("/projects");
}

export async function deleteIssue(id: string) {
	await sql`DELETE FROM issues WHERE id = ${id}`;
	revalidatePath("/projects");
}

export async function updateIssuePositions(
	projectId: string,
	updates: Array<{ id: string; status: Issue["status"]; position: number }>,
) {
	if (updates.length === 0) return;
	try {
		await sql.begin(async transaction => {
			for (const update of updates) {
				await transaction.unsafe(
					"UPDATE issues SET status = $1, position = $2, updated_at = NOW() WHERE id = $3",
					[update.status, update.position, update.id],
				);
			}
		});
	} catch (error) {
		return { message: "Database error: Failed to update issue positions.", error };
	}

	revalidatePath(`/projects/${projectId}`);
	revalidatePath("/projects");
}
