"use server";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
	try {
		const user = await sql`SELECT * FROM users WHERE email=${email}`;
		return user[0] as User | undefined;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}

export async function signIn(data: { email: string; password: string }) {
	const { email, password } = data;
	const user = await getUser(email);

	if (!user) {
		return {
			message: "Invalid credentials",
		};
	}

	const passwordsMatch = await compare(password, user.password);

	if (!passwordsMatch) {
		return {
			message: "Invalid credentials",
		};
	}

	user.password = "";

	const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
	const session = await encrypt({ user, expires });
	(await cookies()).set("session", session, { expires, httpOnly: true });
	redirect("/");
}

export async function signOut() {
	(await cookies()).set("session", "", { expires: new Date(0) });
	redirect("/");
}
