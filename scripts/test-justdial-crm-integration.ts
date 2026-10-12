import * as dotenv from 'dotenv';
dotenv.config();

import { GET } from '../src/pages/api/leads/justdial';
import { POST as RETRY_POST } from '../src/pages/api/leads/justdial/retry-sync';
import { getSupabaseServerClient } from '../src/lib/supabaseServer';

async function runIntegrationTest() {
  console.log('=============================================================================');
  console.log('       SANJAY PROPERTIES JUSTDIAL -> CRM AUTOMATIC INTEGRATION TEST          ');
  console.log('=============================================================================');

  const supabase = getSupabaseServerClient();
  const testLeadId = 'SYNTH_TEST_' + Date.now();
  const testPhone = '9999900001';

  console.log(`\n1. Preparing synthetic test lead: ID = ${testLeadId}`);

  // Test 1: Webhook Ingestion & Immediate Response
  console.log('\n--- TEST 1 & 5 & 6: Calling Justdial Webhook Endpoint ---');
  const targetUrl = new URL(`http://localhost:3000/api/leads/justdial?leadid=${testLeadId}&name=Synthetic%20Tester&mobile=${testPhone}&category=Real%20Estate%20Plots&city=Coimbatore&area=Saravanampatti&date=2026-10-12&time=12:30:00`);

  const mockContext: any = {
    url: targetUrl,
    request: new Request(targetUrl.toString(), { method: 'GET' }),
  };

  const startTime = Date.now();
  const response = await GET(mockContext);
  const elapsedMs = Date.now() - startTime;
  const responseBody = await response.text();

  console.log(`HTTP Status Code: ${response.status} (Expected: 200)`);
  console.log(`Response Content-Type: ${response.headers.get('content-type')}`);
  console.log(`Response Body: "${responseBody}" (Expected exact plain-text: "RECEIVED")`);
  console.log(`Response Time: ${elapsedMs}ms`);

  if (response.status !== 200 || responseBody.trim() !== 'RECEIVED') {
    console.error('❌ FAILED: Webhook endpoint did not return HTTP 200 RECEIVED');
    process.exit(1);
  }
  console.log('✅ PASSED: Webhook returned HTTP 200 RECEIVED');

  // Test 2: Database Persistence
  console.log('\n--- TEST 2: Verifying Supabase Database Persistence ---');
  const { data: dbLead, error: dbError } = await supabase
    .from('justdial_leads')
    .select('*')
    .eq('leadid', testLeadId)
    .single();

  if (dbError || !dbLead) {
    console.error('❌ FAILED: Lead not found in Supabase:', dbError?.message);
    process.exit(1);
  }

  console.log(`Found lead in Supabase: UUID = ${dbLead.id}`);
  console.log(`Lead Name: ${dbLead.name}`);
  console.log(`Lead Mobile: ${dbLead.mobile}`);
  console.log(`CRM Sync Meta in raw_payload:`, JSON.stringify(dbLead.raw_payload?.crm_sync, null, 2));

  const syncStatus = dbLead.crm_sync_status || dbLead.raw_payload?.crm_sync?.status;
  console.log(`Current Sync Status: "${syncStatus}"`);

  if (!syncStatus) {
    console.error('❌ FAILED: crm_sync metadata missing from record');
    process.exit(1);
  }
  console.log('✅ PASSED: Lead saved in Supabase with durable CRM sync metadata');

  // Test 3: Duplicate Request Processing
  console.log('\n--- TEST 3: Verifying Idempotent Duplicate Handling ---');
  const dupResponse = await GET(mockContext);
  const dupBody = await dupResponse.text();
  console.log(`Duplicate Request Response: "${dupBody}"`);

  const { count: leadCount } = await supabase
    .from('justdial_leads')
    .select('id', { count: 'exact', head: true })
    .eq('leadid', testLeadId);

  console.log(`Total records for ${testLeadId} in DB: ${leadCount} (Expected: 1)`);
  if (leadCount !== 1) {
    console.error('❌ FAILED: Duplicate lead created extra rows in database');
    process.exit(1);
  }
  console.log('✅ PASSED: Duplicate request updated record without creating duplicates');

  // Test 4: Retry Mechanism
  console.log('\n--- TEST 4: Verifying Retry Synchronization API ---');
  const retryReq = new Request('http://localhost:3000/api/leads/justdial/retry-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId: testLeadId }),
  });

  const retryRes = await RETRY_POST({ request: retryReq } as any);
  const retryData = await retryRes.json();
  console.log('Retry API Status:', retryRes.status);
  console.log('Retry API Result:', JSON.stringify(retryData, null, 2));

  if (!retryData.status) {
    console.error('❌ FAILED: Retry API did not return a status');
    process.exit(1);
  }
  console.log('✅ PASSED: Retry API executed successfully');

  // Clean up synthetic test lead
  console.log('\n--- CLEANUP: Removing Synthetic Test Record ---');
  await supabase.from('justdial_leads').delete().eq('leadid', testLeadId);
  console.log(`Cleaned up synthetic test lead: ${testLeadId}`);

  console.log('\n=============================================================================');
  console.log('                 ALL AUTOMATED INTEGRATION TESTS PASSED                      ');
  console.log('=============================================================================');
  process.exit(0);
}

runIntegrationTest().catch((err) => {
  console.error('Fatal error during integration test:', err);
  process.exit(1);
});
