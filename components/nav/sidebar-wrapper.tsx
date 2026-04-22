import { AppSidebar } from "./app-sidebar"
import { getSession } from "@/lib/auth"

export default async function SidebarWrapper() {
  const session = await getSession()
  return <AppSidebar user={session?.user ?? null} />
}
