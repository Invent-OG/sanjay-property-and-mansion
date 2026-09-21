import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('Testing Supabase connection...');
  
  // Try calling pg-meta or executing queries
  const schemaSql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'schema.sql'), 'utf-8');
  const seedSql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'seed.sql'), 'utf-8');

  console.log('Schema SQL Length:', schemaSql.length);
  console.log('Seed SQL Length:', seedSql.length);

  // Try standard endpoint
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: schemaSql })
  });

  console.log('RPC exec_sql status:', res.status);
  const text = await res.text();
  console.log('RPC exec_sql response:', text);
}

main().catch(console.error);
