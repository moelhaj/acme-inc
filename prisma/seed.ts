import prisma from "@/lib/prisma"
import { UserRole } from "@/lib/generated/prisma/client"
import { hash } from "bcryptjs"

const users = [
    {
        name: "Maeve Millay",
        email: "maeve.millay@acme-inc.com",
        password: "Password123!",
        title: "Product Manager",
        avatar: "maeve-millay.png",
        role: "admin" as UserRole,
    },
    {
        name: "Dolores Abernathy",
        email: "dolores.abernathy@acme-inc.com",
        password: "Password123!",
        title: "Backend Developer",
        avatar: "dolores-abernathy.png",
        role: "user" as UserRole,
    },
    {
        name: "Robert Ford",
        email: "robert.ford@acme-inc.com",
        password: "Password123!",
        title: "Full-Stack Developer",
        avatar: "robert-ford.png",
        role: "user" as UserRole,
    },
    {
        name: "Bernard Lowe",
        email: "bernard.lowe@acme-inc.com",
        password: "Password123!",
        title: "Frontend Developer",
        avatar: "bernard-lowe.png",
        role: "user" as UserRole,
    },
    {
        name: "Clementine Penny",
        email: "clementine.penny@acme-inc.com",
        password: "Password123!",
        title: "QA Engineer",
        avatar: "clementine-pennyfeather.png",
        role: "user" as UserRole,
    },
]

const projects = [
    {
        title: "CRM System",
        description: "Customer relationship management system for sales teams.",
    },
    {
        title: "Fleet Management System",
        description: "System to manage vehicles, drivers, and routes.",
    },
    {
        title: "SaaS Landing Page",
        description: "High-conversion landing page for a SaaS product.",
    },
]

async function main() {
    for (const user of users) {
        const hashedPassword = await hash(user.password, 10)
        await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                password: hashedPassword,
                title: user.title,
                avatar: user.avatar,
                role: user.role,
            },
            create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                title: user.title,
                avatar: user.avatar,
                role: user.role,
            },
        })
    }

    for (const project of projects) {
        const existingProject = await prisma.project.findFirst({
            where: { title: project.title },
            select: { id: true },
        })

        if (existingProject) {
            await prisma.project.update({
                where: { id: existingProject.id },
                data: {
                    description: project.description,
                },
            })
            continue
        }

        await prisma.project.create({
            data: {
                title: project.title,
                description: project.description,
            },
        })
    }
}

main()
