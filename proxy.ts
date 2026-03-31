import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const session = request.cookies.get("session")?.value;
	const isAuthed = Boolean(session);

	if (pathname === "/") {
		return NextResponse.redirect(
			new URL(isAuthed ? "/dashboard" : "/sign-in", request.url)
		);
	}

	if (protectedRoutes.some(route => pathname.startsWith(route))) {
		if (!isAuthed) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
		return NextResponse.next();
	}

	if (pathname === "/sign-in") {
		if (isAuthed) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}
	return NextResponse.next();
}

const protectedRoutes = ["/dashboard", "/projects"];

export const config = {
	matcher: ["/dashboard/:path*", "/projects/:path*", "/sign-in"],
};
