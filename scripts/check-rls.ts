import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);

async function checkRLS() {
  const tables = await client`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
    WHERE pg_namespace.nspname = 'public' 
    AND relkind = 'r';
  `;
  console.log('Tables and relrowsecurity:');
  console.table(tables);

  const policies = await client`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies
    WHERE schemaname = 'public';
  `;
  console.log('Policies:');
  console.table(policies);

  await client.end();
}

checkRLS().catch(console.error);
