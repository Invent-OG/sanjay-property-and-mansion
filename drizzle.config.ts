import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  tablesFilter: [
    'properties',
    'property_images',
    'accommodations',
    'facilities',
    'meal_plans',
    'meal_subscription_rates',
    'weekly_menu',
    'leads',
    'site_settings',
  ],
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '',
  },
});
