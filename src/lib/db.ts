import { getDatabase } from '@netlify/database';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/db/schema';

let dbConnection;

try {
  // Try to let Netlify auto-detect the database (succeeds in Netlify Functions and Netlify Build)
  // Or use the local DATABASE_URL if the user provided one.
  const options = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined;
  dbConnection = getDatabase(options);
} catch (error) {
  // If getDatabase throws (e.g., during a local `npm run build` without Netlify CLI),
  // fallback to a dummy connection string so the build doesn't crash.
  dbConnection = getDatabase({ connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy' });
}

export const db = drizzle(dbConnection.pool as any, { schema });
