import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.local (Next.js convention) so DIRECT_URL is available to Prisma CLI
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use the DIRECT (non-pooled) URL for CLI commands like db push & migrate
    url: env('DIRECT_URL'),
  },
});
