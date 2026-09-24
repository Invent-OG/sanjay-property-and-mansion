import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function cleanTestLeads() {
  console.log('Searching for test Justdial leads...');
  const deleted = await sql`
    DELETE FROM justdial_leads
    WHERE leadid LIKE 'TEST%' OR leadid = 'JD57154BC2A4E7'
    RETURNING leadid, name, created_at;
  `;

  console.log(`Deleted ${deleted.length} test record(s):`);
  deleted.forEach((r) => {
    console.log(` - ${r.leadid} (${r.name}) created at ${r.created_at}`);
  });

  process.exit(0);
}

cleanTestLeads().catch((err) => {
  console.error('Failed to clean test records:', err);
  process.exit(1);
});
