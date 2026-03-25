import OpenAI from "openai"
import type { Snapshot } from "@/lib/definitions"

export async function callLLM(snapshot: Snapshot) {
    const model = process.env.AI_CHAT_MODEL || "openai/gpt-4.1-mini"
    const openai = new OpenAI({
        apiKey: process.env.AI_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.BASE_URL || "http://localhost:3000",
            "X-OpenRouter-Title": "Acme-in",
            "X-Title": "Acme Inc Dashboard",
        },
    })

    const system = `
            You are an analytics assistant for a project management dashboard.
            You receive a JSON snapshot of metrics computed from the database.
            The snapshot includes a global rollup.

            Return an array of 3 recommended actions to improve projects health.

            Rules:
            - Use ONLY the snapshot data. Never invent numbers or entities.
            - Keep it actionable for an admin.
            - Do not include IDs unless they exist in snapshot (assigneeId ok only if snapshot includes it).

            Example of snapshot:
            {
                tasks: { open: 17, inReview: 6, highOpen: 6 },
                stuck: {
                    highInReviewOver3d: 3,
                    items: Result(3) [ [Object], [Object], [Object] ]
                },
                workload: Result(5) [
                    {
                    user_id: 'ded25c80-d74b-4910-aaa1-41278fcd7efd',
                    name: 'Dolores Abernathy',
                    active: 4,
                    high: 2,
                    score: 16
                    },
                    {
                    user_id: 'c2c420eb-cb9c-44dd-a5fc-f5eb421d4671',
                    name: 'Maeve Millay',
                    active: 4,
                    high: 0,
                    score: 15
                    },
                    {
                    user_id: '9154aed3-4b8f-43a6-89be-9d221c43508f',
                    name: 'Clementine Penny',
                    active: 4,
                    high: 0,
                    score: 10
                    },
                    {
                    user_id: 'a7ba67ea-d3ff-4e25-8170-8862d5f83d62',
                    name: 'Robert Ford',
                    active: 4,
                    high: 0,
                    score: 4
                    },
                    {
                    user_id: 'e763978c-92d0-4a67-8a79-09aa97239c65',
                    name: 'Bernard Lowe',
                    active: 1,
                    high: 0,
                    score: 4
                    }
                ]
            }

            Expected response:
            * Assign a reviewer and close the oldest High and High tasks first.
            * Run a quick triage to confirm which high tasks are truly high and downgrade the rest.
            * Move one or two active tasks from the most overloaded user to the next available teammate.
        `

    const user = `
            Snapshot JSON:
            ${JSON.stringify(snapshot)}
            Generate 3 actions.
        `

    try {
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: system,
                },
                {
                    role: "user",
                    content: user,
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        })

        const content = completion.choices[0]?.message?.content

        if (!content) {
            return aiFallback(snapshot)
        }

        const parsed = JSON.parse(content)
        const actions = parsed.actions
        return actions
    } catch (error) {
        console.error("Error calling LLM:", error)
    }
}

export function aiFallback(snapshot: Snapshot): string[] {
    const { tasks, stuck, overloaded } = snapshot
    const actions: string[] = []

    if (tasks.open > 0) {
        actions.push(
            "Triage open tasks: review and confirm which open items are truly urgent or high priority, and consider downgrading the rest."
        )
    }

    if (tasks.inReview > 0) {
        actions.push(
            "Unblock review: assign a reviewer and close the oldest high/urgent review items first."
        )
    }

    if (stuck.length > 0)
        actions.push(
            "Unblock review: assign a reviewer and close the oldest high/urgent review items first."
        )

    const overloadedCount = Array.isArray(overloaded) ? overloaded.length : 0
    if (overloadedCount > 0)
        actions.push(
            "Rebalance assignments: move 1–2 active items from the most overloaded user to the next available teammate."
        )

    return actions
}
