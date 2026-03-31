import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SparklesIcon } from "@/components/ui/sparkles-icon"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertSquareIcon, AiNetworkIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type actions = Array<string>

export default function AiActions({ actions }: { actions: actions }) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-1">
                    <div className="grid place-content-center p-2">
                        <HugeiconsIcon icon={AiNetworkIcon} />
                    </div>
                    AI Recommended Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="gap-0">
                <div className="space-y-2">
                    {actions.map((action: string, index: number) => (
                        <div
                            key={`ai-action-${index}`}
                            className="rounded-lg bg-accent/50 p-3 text-sm first-letter:uppercase"
                        >
                            {action}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
