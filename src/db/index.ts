import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlClient: ReturnType<typeof postgres> | null = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  const connectionString =
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_DB_URL) ||
    '';

  if (!connectionString) {
    return null;
  }

  try {
    sqlClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // Recommended for Supabase transaction poolers
    });
    dbInstance = drizzle(sqlClient, { schema });
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize Drizzle database client:', error);
    return null;
  }
};

export const isDbConfigured = (): boolean => {
  const connectionString =
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_DB_URL) ||
    '';
  return Boolean(connectionString && connectionString.trim().length > 0);
};

export { schema };
export * from './schema';
