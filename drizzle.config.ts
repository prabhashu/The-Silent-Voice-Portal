import { defineConfig } from "drizzle-kit";
import { getConnectionString } from "@netlify/database";

let url = "";
try {
  url = getConnectionString();
} catch (e) {
  url = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url,
  },
});
