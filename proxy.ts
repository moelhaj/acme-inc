import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = request.cookies.get("session")?.value
    const isAuthed = Boolean(session)

    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(isAuthed ? "/dashboard" : "/login", request.url)
        )
    }

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!isAuthed) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        return NextResponse.next()
    }

    if (pathname === "/login") {
        if (isAuthed) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next()
    }
    return NextResponse.next()
}

const protectedRoutes = ["/dashboard", "/projects", "/tasks"]

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/projects/:path*",
        "/tasks/:path*",
        "/login",
    ],
}
