// src/app/api/auth/[...nextauth]/route.ts
// Exposes GET and POST handlers for NextAuth.js

import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
