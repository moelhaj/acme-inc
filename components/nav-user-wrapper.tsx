import { getSession } from "@/lib/auth";
import { Suspense } from "react";
import { NavUser } from "./nav-user";
import { User } from "@/lib/definitions";

export default async function NavUserWrapper() {
	const session = (await getSession()) as { user: User } | null;
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div>{session && <NavUser user={session.user} />}</div>
		</Suspense>
	);
}
