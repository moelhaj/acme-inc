"use server";

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type TasksByPriority = {
	priority: "low" | "medium" | "high" | "urgent";
	count: number;
};

export type TasksByStatus = {
	status: "todo" | "in_progress" | "in_review" | "done";
	count: number;
};

export type ProjectHealthRow = {
	projectId: string;
	projectName: string;
	completionPercent: number;
	openIssuesCount: number;
	urgentIssuesCount: number;
	healthScore: number;
	status: "Healthy" | "At Risk" | "Blocked";
};

const HEALTHY_THRESHOLD = 0.7;
const AT_RISK_THRESHOLD = 0.4;

const toNumber = (value: unknown) => Number(value ?? 0);

const getHealthStatus = (score: number): ProjectHealthRow["status"] => {
	if (score >= HEALTHY_THRESHOLD) return "Healthy";
	if (score >= AT_RISK_THRESHOLD) return "At Risk";
	return "Blocked";
};

export async function fetchTasksByPriority(): Promise<TasksByPriority[]> {
	try {
		const rows = await sql<{ priority: TasksByPriority["priority"]; count: number }[]>`
			SELECT
				issues.priority,
				COUNT(*)::int AS count
			FROM issues
			GROUP BY issues.priority
			ORDER BY issues.priority;
		`;

		return rows;
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch tasks by priority.");
	}
}

export async function fetchTasksByStatus(): Promise<TasksByStatus[]> {
	try {
		const rows = await sql<{ status: TasksByStatus["status"]; count: number }[]>`
			SELECT
				issues.status,
				COUNT(*)::int AS count
			FROM issues
			GROUP BY issues.status
			ORDER BY issues.status;
		`;

		return rows;
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch tasks by status.");
	}
}

export async function fetchProjectHealth(): Promise<ProjectHealthRow[]> {
	try {
		const rows = await sql<
			{
				project_id: string;
				project_name: string;
				total: number;
				done: number;
				open: number;
				urgent_open: number;
			}[]
		>`
			SELECT
				projects.id AS project_id,
				projects.title AS project_name,
				COUNT(issues.id)::int AS total,
				COUNT(*) FILTER (WHERE issues.status = 'done')::int AS done,
				COUNT(*) FILTER (WHERE issues.status IS NOT NULL AND issues.status <> 'done')::int AS open,
				COUNT(*) FILTER (
					WHERE issues.status IS NOT NULL AND issues.status <> 'done' AND issues.priority = 'urgent'
				)::int AS urgent_open
			FROM projects
			LEFT JOIN issues ON issues.project_id = projects.id
			GROUP BY projects.id, projects.title
			ORDER BY projects.title ASC;
		`;

		return rows.map(row => {
			const total = toNumber(row.total);
			const done = toNumber(row.done);
			const open = toNumber(row.open);
			const urgentOpen = toNumber(row.urgent_open);
			const completionPercent = total === 0 ? 0 : Math.round((done / total) * 100);
			const urgentWeight = total === 0 ? 0 : urgentOpen / total;
			const healthScore = total === 0 ? 0 : Number((done / total - urgentWeight).toFixed(3));
			const status = getHealthStatus(healthScore);

			return {
				projectId: row.project_id,
				projectName: row.project_name,
				completionPercent,
				openIssuesCount: open,
				urgentIssuesCount: urgentOpen,
				healthScore,
				status,
			};
		});
	} catch (error) {
		console.log("Database Error:", error);
		throw new Error("Failed to fetch project health.");
	}
}
