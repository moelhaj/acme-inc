export type User = {
	id: string;
	name: string;
	email: string;
	password: string;
	title: string;
	avatar: string;
	role: "admin" | "user";
	created_at: string;
	updated_at: string;
};

export type Project = {
	id: string;
	title: string;
	description: string;
	status: "todo" | "in_progress" | "in_review" | "done";
	priority: "low" | "medium" | "high" | "urgent";
	created_at: string;
	updated_at: string;
};

export type Issue = {
	id: string;
	project_id: string;
	title: string;
	description: string;
	type: "bug" | "feature" | "improvement";
	status: "todo" | "in_progress" | "in_review" | "done";
	priority: "low" | "medium" | "high" | "urgent";
	position: number;
	created_at: string;
	updated_at: string;
};

export const Statuses = [
	{
		value: "todo",
		label: "To do",
	},
	{
		value: "in_progress",
		label: "In Progress",
	},
	{
		value: "in_review",
		label: "In Review",
	},
	{
		value: "done",
		label: "Done",
	},
];

export const Priorities = [
	{
		label: "Low",
		value: "low",
	},
	{
		label: "Medium",
		value: "medium",
	},
	{
		label: "High",
		value: "high",
	},
	{
		label: "Urgent",
		value: "urgent",
	},
];
