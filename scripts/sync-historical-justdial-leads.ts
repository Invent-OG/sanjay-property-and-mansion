import * as dotenv from 'dotenv';
dotenv.config();

import { getSupabaseServerClient } from '../src/lib/supabaseServer';
import {
  mapJustdialToCrmPayload,
  syncLeadToBudgetAi,
  normalizePhone,
} from '../src/services/budgetAiCrmService';

// Parse command line arguments
const args = process.argv.slice(2);
const isLiveConfirm = args.includes('--confirm-live-sync');
const batchSizeArg = args.find((a) => a.startsWith('--batch-size='));
const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1], 10) || 10 : 10;
const limitArg = args.find((a) => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

async function runHistoricalSync() {
  console.log('=============================================================================');
  console.log('   SANJAY PROPERTIES -> BUDGET AI STUDIO CRM: HISTORICAL LEADS SYNC TOOL    ');
  console.log('=============================================================================');

  if (!isLiveConfirm) {
    console.log('\n⚠️  MODE: DRY-RUN ONLY (Safe Simulation)');
    console.log('   No requests will be sent to Budget AI Studio CRM.');
    console.log('   No database records will be modified.');
    console.log('   To execute live import, pass: --confirm-live-sync\n');
  } else {
    console.log('\n🚀 MODE: LIVE CONTROLLED IMPORT ACTIVATED');
    console.log(`   Batch size: ${batchSize} | Rate limit throttle: 250ms between requests\n`);
  }

  const supabase = getSupabaseServerClient();

  // Query all Justdial leads ordered chronologically
  let query = supabase
    .from('justdial_leads')
    .select('*')
    .not('leadid', 'ilike', 'TEST%')
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: leads, error } = await query;

  if (error || !leads) {
    console.error('❌ Failed to fetch leads from Supabase:', error?.message);
    process.exit(1);
  }

  console.log(`📋 Total historical leads in database: ${leads.length}`);

  // Analyze duplicates and eligibility
  const phoneCountMap = new Map<string, number>();
  leads.forEach((l) => {
    const p = normalizePhone(l.mobile || l.phone);
    if (p) phoneCountMap.set(p, (phoneCountMap.get(p) || 0) + 1);
  });

  const eligibleLeads = leads.filter((l) => {
    const rawStatus = (l.crm_sync_status || l.raw_payload?.crm_sync?.status || 'pending').toLowerCase();
    return rawStatus !== 'synced';
  });

  console.log(`📌 Eligible leads for synchronization (unsynced): ${eligibleLeads.length}`);
  console.log('-----------------------------------------------------------------------------');

  let validCount = 0;
  let missingPhoneCount = 0;
  let duplicatePhoneLeadCount = 0;

  for (let i = 0; i < eligibleLeads.length; i++) {
    const lead = eligibleLeads[i];
    const phone = normalizePhone(lead.mobile || lead.phone);
    const isDuplicatePhone = Boolean(phone && (phoneCountMap.get(phone) || 0) > 1);

    if (isDuplicatePhone) duplicatePhoneLeadCount++;

    const { payload, validationError } = mapJustdialToCrmPayload(lead, isDuplicatePhone);

    if (validationError || !payload) {
      missingPhoneCount++;
      console.log(`[Lead #${i + 1}] ID: ${lead.leadid} -> ❌ INVALID: ${validationError}`);
      continue;
    }

    validCount++;

    if (!isLiveConfirm) {
      console.log(`[Lead #${i + 1}] ID: ${lead.leadid} | Name: ${lead.name || 'N/A'} | Category: ${lead.category || 'N/A'}`);
      console.log(`   Phone: [REDACTED ${phone.slice(0, 3)}****${phone.slice(-3)}] | Duplicate Phone in Inquiries: ${isDuplicatePhone ? 'YES' : 'NO'}`);
      console.log(`   Simulated Payload Requirement: "${payload.requirement}" | Source: "${payload.source}" | Company: "${payload.company}"`);
      console.log(`   Simulated ownerNote Preview:\n   ${payload.ownerNote.split('\n').join('\n   ')}\n`);
    } else {
      // LIVE IMPORT EXECUTION
      process.stdout.write(`[Syncing ${i + 1}/${eligibleLeads.length}] ID: ${lead.leadid}... `);
      try {
        const result = await syncLeadToBudgetAi(lead, {
          timeoutMs: 6000,
          isDuplicatePhone,
        });

        if (result.success) {
          console.log(`✅ SYNCED (CRM ID: ${result.crmLeadId})`);
        } else {
          console.log(`❌ FAILED (${result.error})`);
        }
      } catch (syncErr: any) {
        console.log(`❌ ERROR (${syncErr?.message || syncErr})`);
      }

      // 250ms throttle between calls
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  console.log('=============================================================================');
  console.log('                          SUMMARY REPORT                                     ');
  console.log('=============================================================================');
  console.log(`Total Leads Evaluated:           ${eligibleLeads.length}`);
  console.log(`Valid for CRM Delivery:          ${validCount}`);
  console.log(`Missing / Invalid Phone Numbers: ${missingPhoneCount}`);
  console.log(`Duplicate Phone Inquiries:       ${duplicatePhoneLeadCount}`);

  if (!isLiveConfirm) {
    console.log('\n🔒 DRY-RUN COMPLETED SUCCESSFULLY.');
    console.log('   No external network requests were made.');
    console.log('   To synchronize these leads to Budget AI Studio CRM, run:');
    console.log('   npx tsx scripts/sync-historical-justdial-leads.ts --confirm-live-sync\n');
  } else {
    console.log('\n✅ LIVE HISTORICAL IMPORT PROCESS COMPLETED.\n');
  }

  process.exit(0);
}

runHistoricalSync().catch((err) => {
  console.error('Fatal error during sync process:', err);
  process.exit(1);
});
