# Acme Inc — Project Management Tool

A full-stack project management application built with Next.js, featuring a dashboard with workload analytics, Kanban boards, and team task tracking.

## Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Kanban Board
![Kanban Board](docs/screenshots/kanban.png)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL via [Prisma](https://www.prisma.io/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Auth:** JWT via [jose](https://github.com/panva/jose)
- **Testing:** Jest + Testing Library

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- A running **PostgreSQL** instance

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd acme-inc
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/acme`) |
| `AUTH_SECRET` | A random secret used to sign JWT tokens (e.g. generate with `openssl rand -base64 32`) |

### 4. Set up the database

Run Prisma migrations to create the schema:

```bash
pnpm prisma migrate deploy
```

### 5. Seed the database

Populate the database with demo users and projects:

```bash
pnpm prisma db seed
```

This creates the following demo accounts (password for all: `Password123!`):

| Name | Email | Role |
|---|---|---|
| Maeve Millay | maeve.millay@acme-inc.com | Product Manager |
| Dolores Abernathy | dolores.abernathy@acme-inc.com | Backend Developer |
| Clementine Penny | clementine.penny@acme-inc.com | QA Engineer |
| Robert Ford | robert.ford@acme-inc.com | Full-Stack Developer |

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run test suite |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
acme-inc/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Login / signup routes
│   └── (protected)/      # Authenticated routes (dashboard, projects)
├── actions/              # Next.js Server Actions
├── components/           # Shared React components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
├── prisma/               # Prisma schema, migrations, and seed
├── __tests__/            # Jest test suites
└── public/               # Static assets
```

## Adding UI Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add <component-name>
```

Components are placed in [components/ui/](components/ui/).
