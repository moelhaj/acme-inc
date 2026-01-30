import { AppSidebar } from "@/components/app-sidebar";
import { getSession } from "@/lib/auth";
import { User } from "@/lib/definitions";

export default async function SidebarWrapper() {
	const session = (await getSession()) as { user: User } | null;
	return <AppSidebar user={session?.user ?? null} />;
}
