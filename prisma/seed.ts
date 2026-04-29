import {
    PrismaClient,
    TaskPriority,
    TaskStatus,
} from "@/prisma/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Seeding database...")

    const maeve = await prisma.user.upsert({
        where: { email: "maeve.millay@acme-inc.com" },
        update: {},
        create: {
            name: "Maeve Millay",
            email: "maeve.millay@acme-inc.com",
            title: "Product Manager",
            avatar: "maeve-millay.png",
        },
    })

    const dolores = await prisma.user.upsert({
        where: { email: "dolores.abernathy@acme-inc.com" },
        update: {},
        create: {
            name: "Dolores Abernathy",
            email: "dolores.abernathy@acme-inc.com",
            title: "Backend Developer",
            avatar: "dolores-abernathy.png",
        },
    })

    const robert = await prisma.user.upsert({
        where: { email: "robert.ford@acme-inc.com" },
        update: {},
        create: {
            name: "Robert Ford",
            email: "robert.ford@acme-inc.com",
            title: "Full-Stack Developer",
            avatar: "robert-ford.png",
        },
    })

    const bernard = await prisma.user.upsert({
        where: { email: "bernard.lowe@acme-inc.com" },
        update: {},
        create: {
            name: "Bernard Lowe",
            email: "bernard.lowe@acme-inc.com",
            title: "Frontend Developer",
            avatar: "bernard-lowe.png",
        },
    })

    const clementine = await prisma.user.upsert({
        where: { email: "clementine.penny@acme-inc.com" },
        update: {},
        create: {
            name: "Clementine Penny",
            email: "clementine.penny@acme-inc.com",
            title: "QA Engineer",
            avatar: "clementine-pennyfeather.png",
        },
    })

    console.log("Users created")

    // delete all existing projects and tasks to avoid conflicts with unique constraints
    await prisma.task.deleteMany({})
    await prisma.project.deleteMany({})

    // Create projects

    const project1 = await prisma.project.create({
        data: {
            title: "CRM System",
            description:
                "Customer relationship management system for sales teams.",
            dueDate: new Date("2026-12-31"),
            members: {
                connect: [
                    { id: maeve.id },
                    { id: dolores.id },
                    { id: robert.id },
                    { id: clementine.id },
                    { id: bernard.id },
                ],
            },
        },
    })

    const project2 = await prisma.project.create({
        data: {
            title: "Fleet Management System",
            description: "System to manage vehicles, drivers, and routes.",
            dueDate: new Date("2027-06-30"),
            members: {
                connect: [
                    { id: maeve.id },
                    { id: dolores.id },
                    { id: clementine.id },
                    { id: bernard.id },
                ],
            },
        },
    })

    const project3 = await prisma.project.create({
        data: {
            title: "SaaS Landing Page",
            description: "High-conversion landing page for a SaaS product.",
            dueDate: new Date("2027-12-31"),
            members: {
                connect: [{ id: robert.id }, { id: bernard.id }],
            },
        },
    })

    console.log("Projects created")

    // Create tasks

    await prisma.task.createMany({
        data: [
            // Tasks for Project 1
            {
                title: "Set up project architecture",
                description:
                    "Define folder structure, tooling, and CI/CD pipeline",
                status: TaskStatus.done,
                priority: TaskPriority.high,
                position: 0,
                projectId: project1.id,
                userId: dolores.id,
            },
            {
                title: "Design database schema",
                description:
                    "Create ERD and Prisma schema for products, orders, users",
                status: TaskStatus.done,
                priority: TaskPriority.high,
                position: 1,
                projectId: project1.id,
                userId: robert.id,
            },
            {
                title: "Implement user authentication",
                description: "JWT-based auth with refresh tokens and OAuth",
                status: TaskStatus.in_progress,
                priority: TaskPriority.high,
                position: 0,
                projectId: project1.id,
                userId: dolores.id,
            },
            {
                title: "Build product catalog API",
                description: "REST API endpoints for product CRUD operations",
                status: TaskStatus.in_review,
                priority: TaskPriority.medium,
                position: 0,
                projectId: project1.id,
                userId: robert.id,
            },
            {
                title: "Payment gateway integration",
                description: "Integrate Stripe for payment processing",
                status: TaskStatus.todo,
                priority: TaskPriority.low,
                position: 0,
                projectId: project1.id,
                userId: clementine.id,
            },
            {
                title: "Shopping cart functionality",
                description: "Implement cart state management and persistence",
                status: TaskStatus.todo,
                priority: TaskPriority.high,
                position: 0,
                projectId: project1.id,
                userId: dolores.id,
            },
            {
                title: "Order management system",
                description:
                    "Order tracking, status updates, and notifications",
                status: TaskStatus.todo,
                priority: TaskPriority.medium,
                position: 1,
                projectId: project1.id,
                userId: robert.id,
            },
        ],
    })

    await prisma.task.createMany({
        data: [
            // Tasks for Project 2
            {
                title: "User research and personas",
                description:
                    "Conduct user interviews and define target personas",
                status: TaskStatus.done,
                priority: TaskPriority.high,
                position: 0,
                projectId: project2.id,
                userId: clementine.id,
            },
            {
                title: "Wireframe design",
                description: "Create low-fidelity wireframes for all screens",
                status: TaskStatus.in_progress,
                priority: TaskPriority.high,
                position: 0,
                projectId: project2.id,
                userId: dolores.id,
            },
            {
                title: "Design system creation",
                description: "Build component library and design tokens",
                status: TaskStatus.todo,
                priority: TaskPriority.medium,
                position: 0,
                projectId: project2.id,
                userId: clementine.id,
            },
            {
                title: "Prototype testing",
                description: "Usability testing with interactive prototypes",
                status: TaskStatus.todo,
                priority: TaskPriority.medium,
                position: 1,
                projectId: project2.id,
                userId: clementine.id,
            },
            {
                title: "Navigation architecture",
                description: "Define app navigation structure and user flows",
                status: TaskStatus.todo,
                priority: TaskPriority.high,
                position: 0,
                projectId: project2.id,
                userId: dolores.id,
            },
        ],
    })

    console.log("Tasks created")
    console.log("Seeding complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
