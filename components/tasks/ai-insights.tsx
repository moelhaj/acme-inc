import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AiBeautifyIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AiInsights() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-0 bg-gradient-to-r from-fuchsia-300 via-cyan-300 to-violet-300 p-0.5"
                >
                    <span className="flex items-center gap-2 rounded-md bg-card px-3 py-1">
                        <HugeiconsIcon
                            icon={AiBeautifyIcon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                        Summarize
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>AI Insights</DialogTitle>
                    <DialogDescription>
                        Get a quick summary of your project status, including
                        key accomplishments, upcoming deadlines, and potential
                        risks. This summary is generated using advanced AI
                        algorithms that analyze your project data to provide you
                        with actionable insights.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
