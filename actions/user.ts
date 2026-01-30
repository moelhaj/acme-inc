"use server";

import { User } from "@/lib/definitions";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
	errors?: {
		customerId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};

export async function fetchUsers() {
	try {
		const users = await sql<User[]>`SELECT * FROM users ORDER BY created_at DESC`;
		return users;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch users.");
	}
}
