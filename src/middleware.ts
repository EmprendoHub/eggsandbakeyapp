import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminPath = "/admin";
const agentPath = "/agente";
const adminOnlyPaths = [
  "/admin",
  "/admin/clients",
  "/admin/agentes",
  "/admin/users",
];
const agentAllowedPaths = ["/admin/agente", "/admin/agente/clientes"];
const publicAdminPaths = ["/admin/login", "/admin/setup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(adminPath)) {
    if (publicAdminPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (agentAllowedPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "AGENTE") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (adminOnlyPaths.some((path) => pathname.startsWith(path))) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/agente", request.url));
      }
      return NextResponse.next();
    }
  }

  if (pathname.startsWith(agentPath)) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "AGENTE") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agente/:path*"],
};
