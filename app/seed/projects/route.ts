import bcrypt from "bcrypt";
import postgres from "postgres";
import { projects } from "./data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedProjects() {
	await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status  status NOT NULL DEFAULT 'todo',
      priority priority NOT NULL DEFAULT 'medium',
      ai_summary TEXT,
      embedding VECTOR(1536),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

	const insertedProjects = await Promise.all(
		projects.map(async project => {
			return sql`
        INSERT INTO projects (title, description, status, priority)
        VALUES (${project.title}, ${project.description}, ${project.status}, ${project.priority});
      `;
		})
	);

	return insertedProjects;
}

export async function GET() {
	try {
		const result = await sql.begin(sql => [seedProjects()]);

		return Response.json({ message: "Database seeded successfully" });
	} catch (error) {
		console.log("Seeding error:", error);
		return Response.json({ error }, { status: 500 });
	}
}
