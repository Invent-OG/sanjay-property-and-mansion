import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

// Configuration
const CRM_API_URL = 'https://crm.budgetaistudio.com/api/agent/v1/leads';
const PROD_SITE_URL = process.env.APP_URL && process.env.APP_URL.startsWith('https://')
  ? process.env.APP_URL
  : 'https://www.sanjayproperties.in';

const apiKey = process.env.BUDGET_AI_API_KEY || '';
const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Designated, controlled test phone number
const CONTROLLED_TEST_PHONE = process.env.CRM_TEST_PHONE || '9999900000';

if (!apiKey) {
  console.error('❌ Configuration Error: BUDGET_AI_API_KEY is not set in environment.');
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Configuration Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Sanitizes strings for console output (redacting keys/tokens/sensitive values).
 */
function maskSecret(val: string): string {
  if (!val) return '[NOT_SET]';
  if (val.length <= 8) return '***';
  return `${val.slice(0, 4)}...${val.slice(-4)}`;
}

async function verifyCrmIntegration() {
  console.log('======================================================================');
  console.log('      SANJAY PROPERTIES -> BAS AI CRM SINGLE E2E VERIFICATION         ');
  console.log('======================================================================\n');

  console.log(`[Config] Production Site URL: ${PROD_SITE_URL}`);
  console.log(`[Config] CRM API URL: ${CRM_API_URL}`);
  console.log(`[Config] Controlled Test Phone: ${CONTROLLED_TEST_PHONE}`);
  console.log(`[Config] BUDGET_AI_API_KEY: Configured (${maskSecret(apiKey)})`);

  // -------------------------------------------------------------------------
  // STEP 1: Verify CRM Authentication (Read-only, without creating duplicate leads)
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 1: Read-Only CRM API Authentication Check ---');
  let authOk = false;
  try {
    const authRes = await fetch(`${CRM_API_URL}?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    console.log(`CRM Auth Status: ${authRes.status} ${authRes.statusText}`);
    if (authRes.status === 200) {
      const authData = await authRes.json();
      console.log(`✅ CRM API Authentication Verified. Total CRM Leads Count: ${authData?.total ?? 'N/A'}`);
      authOk = true;
    } else {
      const errText = await authRes.text();
      console.error(`❌ CRM Authentication Failed: ${authRes.status} ${authRes.statusText}`);
      console.error(`Response: ${errText.slice(0, 200)}`);
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`❌ Network error contacting CRM: ${err.message}`);
    process.exit(1);
  }

  if (!authOk) {
    console.error('Stopping verification: CRM authentication could not be established.');
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // STEP 2: Pre-Flight Safety Verification for Controlled Test Phone
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 2: Pre-Flight Phone Safety & Idempotency Check ---');
  console.log(`Verifying test phone safety (${CONTROLLED_TEST_PHONE}) in Supabase...`);

  const { data: phoneMatches, error: phoneErr } = await supabase
    .from('justdial_leads')
    .select('id, leadid, name, source')
    .or(`mobile.eq.${CONTROLLED_TEST_PHONE},phone.eq.${CONTROLLED_TEST_PHONE}`);

  if (phoneErr) {
    console.warn(`⚠️ Notice querying test phone in database: ${phoneErr.message}`);
  } else if (phoneMatches && phoneMatches.length > 0) {
    const realCustomerMatch = phoneMatches.find(
      (m) => !m.leadid?.startsWith('TEST_') && !m.leadid?.startsWith('SYNTH_')
    );
    if (realCustomerMatch) {
      console.error(`❌ SAFETY ABORT: Controlled test phone ${CONTROLLED_TEST_PHONE} is associated with a real lead record (ID: ${realCustomerMatch.id}). Choose an unused dedicated test phone via CRM_TEST_PHONE.`);
      process.exit(1);
    }
    console.log(`ℹ️ Test phone was previously used in ${phoneMatches.length} synthetic test run(s). Safe to proceed idempotently.`);
  } else {
    console.log(`✅ Test phone ${CONTROLLED_TEST_PHONE} has no conflicting customer records.`);
  }

  // -------------------------------------------------------------------------
  // STEP 3: Single End-to-End Test via Production Justdial Webhook
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 3: Executing Single E2E Test via Production Webhook ---');
  const syntheticLeadId = `TEST_SYNTH_${Date.now()}`;
  const webhookUrl = `${PROD_SITE_URL}/api/leads/justdial`;

  const webhookPayload: Record<string, string> = {
    leadid: syntheticLeadId,
    leadtype: 'Synthetic E2E Verification',
    prefix: 'Mr',
    name: 'BAS AI Verification Prospect',
    mobile: CONTROLLED_TEST_PHONE,
    phone: CONTROLLED_TEST_PHONE,
    email: 'synthetic-e2e@sanjayproperties.in',
    date: new Date().toISOString().split('T')[0],
    time: '14:30:00',
    category: 'CRM Integration Verification',
    city: 'Coimbatore',
    area: 'Saravanampatti',
    brancharea: 'Saravanampatti',
    company: 'Sanjay Properties Test Bed',
    pincode: '641035',
  };

  const queryParams = new URLSearchParams(webhookPayload);
  const fullWebhookUrl = `${webhookUrl}?${queryParams.toString()}`;

  console.log(`Dispatching webhook for synthetic lead: ${syntheticLeadId}`);
  console.log(`Endpoint: ${webhookUrl}`);

  let webhookSuccess = false;
  try {
    const webhookRes = await fetch(fullWebhookUrl, {
      method: 'GET',
    });

    const responseText = await webhookRes.text();
    const contentType = webhookRes.headers.get('content-type') || '';

    console.log(`Webhook HTTP Status: ${webhookRes.status} (Expected: 200)`);
    console.log(`Webhook Content-Type: ${contentType} (Expected: text/plain)`);
    console.log(`Webhook Raw Body: "${responseText}" (Expected: "RECEIVED")`);

    if (webhookRes.status === 200 && responseText.trim() === 'RECEIVED') {
      console.log('✅ Webhook Response Verified: HTTP 200 with exact plain-text "RECEIVED".');
      webhookSuccess = true;
    } else {
      console.error('❌ Webhook Response Assertion Failed!');
    }
  } catch (err: any) {
    console.error(`❌ Webhook network error: ${err.message}`);
  }

  if (!webhookSuccess) {
    console.error('Aborting further verification because the webhook endpoint failed.');
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // STEP 4: Verify Database Persistence & Compare Columns vs raw_payload
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 4: Verifying Supabase Database Persistence & Sync Status ---');
  // Allow brief window for serverless database commit and background sync
  console.log('Awaiting record confirmation in Supabase (3s)...');
  await new Promise((r) => setTimeout(r, 3000));

  const { data: dbLead, error: dbErr } = await supabase
    .from('justdial_leads')
    .select('*')
    .eq('leadid', syntheticLeadId)
    .maybeSingle();

  if (dbErr || !dbLead) {
    console.error(`❌ Lead persistence failed: synthetic lead ${syntheticLeadId} not found in database.`, dbErr?.message);
    process.exit(1);
  }

  console.log(`✅ Lead persisted in Supabase: ID = ${dbLead.id}, Lead ID = ${dbLead.leadid}`);

  // Extract from raw_payload.crm_sync
  const rawCrmSync = dbLead.raw_payload?.crm_sync || {};
  const rawStatus = rawCrmSync.status || null;
  const rawCrmLeadId = rawCrmSync.crm_lead_id || null;
  const rawSyncedAt = rawCrmSync.synced_at || null;
  const rawError = rawCrmSync.error || null;

  // Extract from dedicated columns (if present in database schema)
  const colStatus = dbLead.crm_sync_status !== undefined ? dbLead.crm_sync_status : '[COLUMN_NOT_IN_SCHEMA]';
  const colCrmLeadId = dbLead.crm_lead_id !== undefined ? dbLead.crm_lead_id : '[COLUMN_NOT_IN_SCHEMA]';
  const colSyncedAt = dbLead.crm_synced_at !== undefined ? dbLead.crm_synced_at : '[COLUMN_NOT_IN_SCHEMA]';
  const colError = dbLead.crm_sync_error !== undefined ? dbLead.crm_sync_error : '[COLUMN_NOT_IN_SCHEMA]';

  console.log('\n[Comparison] Dedicated Columns vs raw_payload.crm_sync:');
  console.table({
    'Sync Status': {
      'Dedicated Column': colStatus,
      'raw_payload.crm_sync': rawStatus,
      'Match': colStatus === '[COLUMN_NOT_IN_SCHEMA]' ? 'N/A (Schema uses JSONB)' : (colStatus === rawStatus ? 'MATCH' : 'DISAGREEMENT'),
    },
    'CRM Lead ID': {
      'Dedicated Column': colCrmLeadId,
      'raw_payload.crm_sync': rawCrmLeadId,
      'Match': colCrmLeadId === '[COLUMN_NOT_IN_SCHEMA]' ? 'N/A (Schema uses JSONB)' : (colCrmLeadId === rawCrmLeadId ? 'MATCH' : 'DISAGREEMENT'),
    },
    'Synced At': {
      'Dedicated Column': colSyncedAt,
      'raw_payload.crm_sync': rawSyncedAt,
      'Match': colSyncedAt === '[COLUMN_NOT_IN_SCHEMA]' ? 'N/A (Schema uses JSONB)' : (colSyncedAt === rawSyncedAt ? 'MATCH' : 'DISAGREEMENT'),
    },
    'Error': {
      'Dedicated Column': colError,
      'raw_payload.crm_sync': rawError,
      'Match': colError === '[COLUMN_NOT_IN_SCHEMA]' ? 'N/A (Schema uses JSONB)' : (colError === rawError ? 'MATCH' : 'DISAGREEMENT'),
    },
  });

  const effectiveStatus = (colStatus !== '[COLUMN_NOT_IN_SCHEMA]' && colStatus) ? colStatus : rawStatus;
  const recordedCrmLeadId = (colCrmLeadId !== '[COLUMN_NOT_IN_SCHEMA]' && colCrmLeadId) ? colCrmLeadId : rawCrmLeadId;

  if (effectiveStatus !== 'synced') {
    console.error(`❌ CRM synchronization status is not "synced" (Current: ${effectiveStatus}, Error: ${rawError || colError})`);
    process.exit(1);
  }
  console.log(`✅ CRM Synchronization Status: "synced"`);

  if (!recordedCrmLeadId) {
    console.error(`❌ CRM lead ID was not recorded.`);
    process.exit(1);
  }
  console.log(`✅ CRM Lead ID Recorded: ${recordedCrmLeadId}`);

  // -------------------------------------------------------------------------
  // STEP 5: Independently Verify Corresponding Lead Exists in BAS AI CRM
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 5: Independent Verification in BAS AI CRM ---');
  let crmRecordFound = false;
  let crmVerifiedLeadDetails: any = null;

  // Attempt A: Direct lookup by CRM Lead ID if it's a UUID/ID
  if (recordedCrmLeadId && !recordedCrmLeadId.startsWith('CRM-')) {
    try {
      console.log(`Fetching direct lead by ID: ${CRM_API_URL}/${recordedCrmLeadId}`);
      const directRes = await fetch(`${CRM_API_URL}/${recordedCrmLeadId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (directRes.status === 200) {
        const directData = await directRes.json();
        if (directData?.lead?.id === recordedCrmLeadId || directData?.id === recordedCrmLeadId) {
          crmRecordFound = true;
          crmVerifiedLeadDetails = directData.lead || directData;
          console.log(`✅ Direct ID Lookup Confirmed: Found lead in CRM matching ID ${recordedCrmLeadId}`);
        }
      }
    } catch (err: any) {
      console.warn(`Direct ID lookup note: ${err.message}`);
    }
  }

  // Attempt B: Lookup by controlled test phone number
  if (!crmRecordFound) {
    try {
      console.log(`Searching CRM by phone: ${CRM_API_URL}?search=${CONTROLLED_TEST_PHONE}`);
      const searchRes = await fetch(`${CRM_API_URL}?search=${CONTROLLED_TEST_PHONE}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (searchRes.status === 200) {
        const searchData = await searchRes.json();
        const matchedLead = (searchData?.leads || []).find(
          (l: any) => l.phone === CONTROLLED_TEST_PHONE || l.id === recordedCrmLeadId
        );

        if (matchedLead) {
          crmRecordFound = true;
          crmVerifiedLeadDetails = matchedLead;
          console.log(`✅ Phone Lookup Confirmed: Found lead in CRM with ID: ${matchedLead.id}`);
        }
      }
    } catch (err: any) {
      console.warn(`Phone search lookup note: ${err.message}`);
    }
  }

  if (!crmRecordFound) {
    console.error('❌ Verification Failed: Could not independently verify the corresponding lead in BAS AI CRM.');
    process.exit(1);
  }

  console.log('✅ Independent CRM Verification Succeeded:');
  console.log(`   CRM Lead ID: ${crmVerifiedLeadDetails.id}`);
  console.log(`   CRM Stage: ${crmVerifiedLeadDetails.crmStage || crmVerifiedLeadDetails.leadStatus || 'New'}`);
  console.log(`   Company: ${crmVerifiedLeadDetails.company || 'N/A'}`);
  console.log(`   Source: ${crmVerifiedLeadDetails.source || 'N/A'}`);
  console.log(`   Requirement: ${crmVerifiedLeadDetails.requirement || 'N/A'}`);

  // -------------------------------------------------------------------------
  // STEP 6: Controlled Cleanup (Removes ONLY synthetic lead from database)
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 6: Controlled Database Hygiene Cleanup ---');
  console.log(`Targeting strictly synthetic Lead ID: ${syntheticLeadId}`);

  // Strict safety check: only delete if ID starts with TEST_SYNTH_
  if (syntheticLeadId.startsWith('TEST_SYNTH_')) {
    const { error: delErr } = await supabase
      .from('justdial_leads')
      .delete()
      .eq('leadid', syntheticLeadId);

    if (delErr) {
      console.warn(`⚠️ Warning cleaning up synthetic test record: ${delErr.message}`);
    } else {
      console.log(`✅ Successfully deleted synthetic test record (${syntheticLeadId}) from Supabase.`);
    }
  } else {
    console.warn(`⚠️ Cleanup skipped: lead ID pattern safety check was not met.`);
  }

  console.log('ℹ️ Notice: CRM records preserved without automatic deletion as instructed.');
  console.log('ℹ️ Notice: Historical leads remain untouched.');

  console.log('\n======================================================================');
  console.log('           ALL 6 END-TO-END VERIFICATION CHECKS PASSED                ');
  console.log('======================================================================\n');
}

verifyCrmIntegration();
