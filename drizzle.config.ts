import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: "./drizzle" as string,
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"] as string[], 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
})
