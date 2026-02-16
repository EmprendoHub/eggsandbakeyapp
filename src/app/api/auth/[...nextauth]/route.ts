import type { NextRequest } from "next/server";
import NextAuth from "next-auth";

export async function GET(request: NextRequest, context: unknown) {
	const { authOptions } = await import("@/lib/auth");
	const handler = NextAuth(authOptions);
	return handler(request, context);
}

export async function POST(request: NextRequest, context: unknown) {
	const { authOptions } = await import("@/lib/auth");
	const handler = NextAuth(authOptions);
	return handler(request, context);
}
