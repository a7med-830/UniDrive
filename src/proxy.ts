// src/middleware.ts
// Uses ONLY the Edge-compatible authConfig — no Prisma, no Node.js APIs.
// The authorized() callback in authConfig handles route protection.

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
