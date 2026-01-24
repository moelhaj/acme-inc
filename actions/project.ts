"use server";

import { Project } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

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

const parseListParam = (value: string) =>
	value
		.split(",")
		.map(item => item.trim())
		.filter(Boolean);

const buildProjectFilters = (query: string, status: string, priority: string) => {
	const filters: ReturnType<typeof sql>[] = [];

	if (query) {
		filters.push(
			sql`(projects.title ILIKE ${`%${query}%`} OR projects.description ILIKE ${`%${query}%`})`,
		);
	}

	const statusValues = parseListParam(status);
	if (statusValues.length > 0) {
		filters.push(sql`projects.status = ANY(${statusValues})`);
	}

	const priorityValues = parseListParam(priority);
	if (priorityValues.length > 0) {
		filters.push(sql`projects.priority = ANY(${priorityValues})`);
	}

	if (filters.length === 0) {
		return sql``;
	}

	return sql`WHERE ${filters.reduce((acc, filter, i) =>
		i === 0 ? filter : sql`${acc} AND ${filter}`,
	)}`;
};

export async function fetchProjectsPages(
	query: string,
	itemsPerPage: number,
	status: string,
	priority: string,
) {
	try {
		const whereClause = buildProjectFilters(query, status, priority);
		const data = await sql`SELECT COUNT(*)
        FROM projects
        ${whereClause}
    `;

		const totalPages = Math.ceil(Number(data[0].count) / itemsPerPage);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of projects.");
	}
}

export async function fetchFilteredProjects(
	query: string,
	currentPage: number,
	itemsPerPage = 10,
	status: string,
	priority: string,
) {
	const offset = (currentPage - 1) * itemsPerPage;

	try {
		const whereClause = buildProjectFilters(query, status, priority);
		const projects = await sql<Project[]>`
      SELECT
        projects.id,
        projects.title,
        projects.description,
        projects.status,
        projects.priority,
        projects.created_at,
        projects.updated_at
      FROM projects
      ${whereClause}
      ORDER BY projects.created_at DESC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

		return projects;
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch projects.");
	}
}

export async function fetchProjectById(id: string) {
	try {
		const projects = await sql<Project[]>`
        SELECT *
        FROM projects
        WHERE projects.id = ${id}
      `;

		return projects[0];
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch project.");
	}
}

export async function createProject(data: Omit<Project, "id" | "created_at" | "updated_at">) {
	const { title, description, status, priority } = data;
	try {
		await sql`
            INSERT INTO projects (title, description, status, priority)
            VALUES (${title}, ${description}, ${status}, ${priority})
        `;
	} catch (error) {
		return {
			message: "Database error: Failed to create project.",
			error,
		};
	}
	revalidatePath("/projects");
}

export async function updateProject(
	id: string,
	data: Omit<Project, "id" | "created_at" | "updated_at">,
) {
	const { title, description, status, priority } = data;
	try {
		await sql`
            UPDATE projects
            SET title = ${title},
            description = ${description},
            status = ${status},
            priority = ${priority},
            updated_at = NOW()
            WHERE id = ${id}
        `;
	} catch (error) {
		return { message: "Database error: Failed to update project.", error };
	}
	revalidatePath("/projects");
}

export async function deleteProject(id: string) {
	await sql`DELETE FROM projects WHERE id = ${id}`;
	revalidatePath("/projects");
}
