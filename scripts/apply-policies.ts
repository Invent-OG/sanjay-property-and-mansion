import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('DATABASE_URL is missing from .env');
  process.exit(1);
}

const client = postgres(connectionString);

async function applyPolicies() {
  console.log('🔒 Applying Row Level Security (RLS) policies to PostgreSQL...');

  const tables = [
    'properties',
    'accommodations',
    'facilities',
    'meal_plans',
    'meal_subscription_rates',
    'weekly_menu',
    'property_images',
    'site_settings',
    'leads'
  ];

  for (const t of tables) {
    await client.unsafe(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
    await client.unsafe(`DROP POLICY IF EXISTS "Public read ${t}" ON ${t};`);
    await client.unsafe(`DROP POLICY IF EXISTS "Admin write ${t}" ON ${t};`);
    await client.unsafe(`DROP POLICY IF EXISTS "Public insert ${t}" ON ${t};`);
    await client.unsafe(`DROP POLICY IF EXISTS "Admin full access ${t}" ON ${t};`);
    await client.unsafe(`DROP POLICY IF EXISTS "Allow all ${t}" ON ${t};`);
    await client.unsafe(`CREATE POLICY "Allow all ${t}" ON ${t} FOR ALL TO public USING (true) WITH CHECK (true);`);
    console.log(`  ✓ RLS enabled with full public access for table: ${t}`);
  }

  console.log('✅ RLS policies applied successfully!');
  await client.end();
}

applyPolicies().catch(async (err) => {
  console.error('❌ Failed to apply policies:', err);
  await client.end();
  process.exit(1);
});
