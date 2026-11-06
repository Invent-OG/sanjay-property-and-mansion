import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_ADMIN_EMAIL = 'admin@sanjayproperties.in';
const DEFAULT_ADMIN_PASSWORD = 'AdminPassword@123';
const DEFAULT_ADMIN_HASH =
  '0d3e46c08846bb901d6479a11777d3b5:f1538d8179756a80382d6dea6db4724bcef75fa2dddb83944864ca42dfac86c35f13048fd315afcbc8d3e4c10750be36600826849029d5d2bbd1ec9409279083';

async function main() {
  console.log('===============================================================');
  console.log('🚀 Setting up Admin Users Table & Credentials');
  console.log('===============================================================');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  // 1. Try direct PostgreSQL migration if DATABASE_URL is available
  if (databaseUrl) {
    console.log('Connecting to PostgreSQL via DATABASE_URL...');
    try {
      const sql = postgres(databaseUrl, { prepare: false });
      const migrationFile = path.join(process.cwd(), 'supabase', 'create_users_table.sql');
      const migrationSql = fs.readFileSync(migrationFile, 'utf8');

      console.log('Executing create_users_table.sql...');
      await sql.unsafe(migrationSql);
      console.log('✅ Successfully created users table and seeded admin credentials via PostgreSQL!');
      await sql.end();
      printCredentials();
      return;
    } catch (pgErr: any) {
      console.warn('PostgreSQL connection attempt result:', pgErr.message);
    }
  }

  // 2. Try inserting via Supabase REST Client
  if (supabaseUrl && serviceRoleKey) {
    console.log('Connecting via Supabase REST API...');
    const client = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await client
      .from('users')
      .upsert(
        {
          email: DEFAULT_ADMIN_EMAIL,
          password_hash: DEFAULT_ADMIN_HASH,
          name: 'Administrator',
          role: 'superadmin',
          is_active: true,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'email' }
      )
      .select();

    if (!error) {
      console.log('✅ Admin user record verified/inserted in Supabase public.users table!');
      printCredentials();
      return;
    } else {
      console.log('Notice from Supabase REST API:', error.message);
      if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
        console.log('\n💡 The table "public.users" needs to be created in your Supabase database.');
        console.log('You can run the migration script directly in your Supabase SQL Editor:');
        console.log('👉 File path: supabase/create_users_table.sql\n');
      }
    }
  }

  printCredentials();
}

function printCredentials() {
  console.log('---------------------------------------------------------------');
  console.log('🔑 ADMIN LOGIN CREDENTIALS:');
  console.log(`   Email:    ${DEFAULT_ADMIN_EMAIL}`);
  console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
  console.log('   Role:     superadmin');
  console.log('   Panel:    http://localhost:3000/admin/login');
  console.log('---------------------------------------------------------------');
  console.log('👉 You can change this password anytime in Admin Panel:');
  console.log('   Settings → Admin Security & Credentials');
  console.log('===============================================================\n');
}

main().catch(console.error);
