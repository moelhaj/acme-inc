import bcrypt from "bcrypt";
import postgres from "postgres";
import { users } from "./data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function init() {
	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
                CREATE EXTENSION "uuid-ossp";
            END IF;
        END
        $$;
    `;

	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
                CREATE EXTENSION "pgcrypto";
            END IF;
        END
        $$;
    `;

	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
                CREATE EXTENSION "vector";
            END IF;
        END
        $$;
    `;

	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
                CREATE TYPE role AS ENUM ('admin', 'user');
            END IF;
        END
        $$;
    `;

	// create enum status if not exists
	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
                CREATE TYPE status AS ENUM ('todo', 'in_progress', 'in_review', 'done');
            END IF;
        END
        $$;
    `;

	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority') THEN
                CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');
            END IF;
        END
        $$;
    `;

	await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type') THEN
                CREATE TYPE type AS ENUM ('bug', 'feature', 'improvement');
            END IF;
        END
        $$;
    `;
}

async function seedUsers() {
	await sql`
    CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name        text        NOT NULL,
        email       text        NOT NULL UNIQUE,
        title       text NOT NULL,
        avatar      text NOT NULL,
        role        role   NOT NULL DEFAULT 'user',
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

	const insertedUsers = await Promise.all(
		users.map(async user => {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			return sql`
        INSERT INTO users (name, email, title, avatar, role, password)
        VALUES (${user.name}, ${user.email}, ${user.title}, ${user.avatar}, ${user.role}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
		})
	);

	return insertedUsers;
}

async function createProjectsTable() {
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
}

async function createIssuesTable() {
	await sql`
    CREATE TABLE IF NOT EXISTS issues (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status  status NOT NULL DEFAULT 'todo',
      priority priority NOT NULL DEFAULT 'medium',
      position INT NOT NULL DEFAULT 0,
      type type NOT NULL DEFAULT 'feature',
      ai_summary TEXT,
      suggested_by_ai BOOLEAN NOT NULL DEFAULT FALSE,
      embedding VECTOR(1536),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function GET() {
	try {
		const result = await sql.begin(sql => [
			init(),
			seedUsers(),
			createProjectsTable(),
			createIssuesTable(),
		]);

		return Response.json({ message: "Database seeded successfully" });
	} catch (error) {
		console.log("Seeding error:", error);
		return Response.json({ error }, { status: 500 });
	}
}
