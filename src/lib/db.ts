import { getDatabase } from '@netlify/database';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/db/schema';

// Let getDatabase auto-detect the Netlify environment connection if we're on Netlify.
// Otherwise, use local DATABASE_URL or a dummy string to prevent Next.js build errors locally.
const isNetlify = process.env.NETLIFY === "true";
const options = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL }
  : (isNetlify ? undefined : { connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy' });

const dbConnection = getDatabase(options);

export const db = drizzle(dbConnection.pool as any, { schema });
