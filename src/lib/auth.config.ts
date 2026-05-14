// src/lib/auth.config.ts
// Edge-compatible auth config — NO Prisma, NO Node.js-only imports.
// Used by middleware to verify JWT sessions without hitting the DB.

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/api/admin");

      if (isAdminPath) {
        // Allow access to /admin/login when not logged in
        if (nextUrl.pathname === "/admin/login" && !isLoggedIn) return true;
        // Require "admin" role for admin routes
        return isLoggedIn && auth?.user?.role === "admin";
      }
      return true; // all other routes are public
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // providers live in auth.ts (Node.js runtime only)
};
