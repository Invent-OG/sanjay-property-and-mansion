import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);

async function check() {
  const tables = await client`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log('Tables in public schema:');
  for (const t of tables) {
    const [{ count }] = await client`SELECT count(*) FROM ${client(t.table_name)}`;
    console.log(`- ${t.table_name}: ${count} rows`);
  }
  await client.end();
}

check().catch(console.error);
