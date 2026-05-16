import { getDatabase } from '@netlify/database';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/db/schema';

// Use getDatabase to auto-detect connection string from Netlify environment
const dbConnection = getDatabase({
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy'
});

export const db = drizzle(dbConnection.pool as any, { schema });
