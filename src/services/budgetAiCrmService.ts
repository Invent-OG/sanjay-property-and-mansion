import { getSupabaseServerClient } from '../lib/supabaseServer';

export interface CrmLeadPayload {
  name: string;
  phone: string;
  email: string;
  company: string;
  requirement: string;
  source: string;
  campaign: string;
  ownerNote: string;
}

export interface CrmSyncResult {
  success: boolean;
  crmLeadId?: string;
  error?: string;
  status: 'synced' | 'failed' | 'pending';
}

const CRM_API_URL = 'https://crm.budgetaistudio.com/api/agent/v1/leads';

/**
 * Normalizes phone number into clean digits (e.g., removing spaces, hyphens, prefixes).
 */
export function normalizePhone(rawPhone?: string | null): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  // If 12 digits starting with 91, extract the 10-digit mobile
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Builds the ownerNote string preserving all Justdial metadata for CRM sales agents.
 */
export function formatOwnerNote(lead: any, duplicatePhoneDetected: boolean = false): string {
  const parts: string[] = [];

  if (duplicatePhoneDetected) {
    parts.push(`[DUPLICATE PHONE NOTICE: An inquiry with this phone number was previously registered. Review historical inquiries below.]`);
  }

  parts.push(`[Justdial Inbound Inquiry]`);
  parts.push(`Justdial Lead ID: ${lead.leadid || 'N/A'}`);

  const dateStr = lead.lead_date || lead.leadDate || (lead.created_at ? String(lead.created_at).split('T')[0] : 'N/A');
  const timeStr = lead.lead_time || lead.leadTime || '';
  parts.push(`Inquiry Timestamp: ${dateStr}${timeStr ? ' at ' + timeStr : ''}`);

  if (lead.category) parts.push(`Category: ${lead.category}`);
  if (lead.leadtype) parts.push(`Channel Type: ${lead.leadtype}`);
  if (lead.company) parts.push(`Prospect Company: ${lead.company}`);

  const locParts = [lead.area, lead.city, lead.pincode].filter(Boolean);
  if (locParts.length > 0) parts.push(`Location: ${locParts.join(', ')}`);

  if (lead.brancharea || lead.branchpin) {
    parts.push(`Justdial Branch: ${lead.brancharea || 'N/A'}${lead.branchpin ? ' (PIN: ' + lead.branchpin + ')' : ''}`);
  }

  const dncMobile = lead.dncmobile === 1 ? 'ACTIVE (Do Not Call)' : 'Clear';
  const dncPhone = lead.dncphone === 1 ? 'ACTIVE (Do Not Call)' : 'Clear';
  parts.push(`DND Status: Mobile DND = ${dncMobile}, Phone DND = ${dncPhone}`);

  if (lead.parentid) parts.push(`Campaign Parent ID: ${lead.parentid}`);

  return parts.join('\n');
}

/**
 * Maps a Justdial database record to the documented Budget AI Studio CRM payload.
 */
export function mapJustdialToCrmPayload(
  lead: any,
  duplicatePhoneDetected: boolean = false
): { payload: CrmLeadPayload | null; validationError?: string } {
  // 1. Phone is strictly required by the CRM API
  const phone = normalizePhone(lead.mobile || lead.phone);
  if (!phone || phone.length < 7) {
    return {
      payload: null,
      validationError: 'Validation Error: Missing or invalid phone number (required by Budget AI Studio CRM)',
    };
  }

  // 2. Format prospect full name
  const prefixStr = lead.prefix ? lead.prefix.trim() + ' ' : '';
  const fullName = lead.name ? (prefixStr + lead.name.trim()).trim() : 'Justdial Prospect';

  // 3. Email
  const email = (lead.email || '').trim();

  // 4. Company (Default to Sanjay Properties or business unit)
  const company = (lead.company && lead.company.trim()) || 'Sanjay Properties';

  // 5. Requirement
  const requirement = (lead.category && lead.category.trim()) || 'Real Estate';

  // 6. Campaign
  const campaign = (lead.parentid && lead.parentid.trim()) || (lead.leadtype && lead.leadtype.trim()) || 'Justdial Telephony Campaign';

  // 7. Structured ownerNote
  const ownerNote = formatOwnerNote(lead, duplicatePhoneDetected);

  return {
    payload: {
      name: fullName,
      phone,
      email,
      company,
      requirement,
      source: 'justdial',
      campaign,
      ownerNote,
    },
  };
}

/**
 * Updates CRM sync status in Supabase.
 * Gracefully writes to first-class columns if they exist, and always stores in raw_payload.crm_sync.
 */
export async function updateLeadSyncStatusInDb(
  leadId: string,
  result: CrmSyncResult
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const nowIso = new Date().toISOString();

  try {
    // 1. Fetch existing raw_payload to merge
    const { data: existingLead } = await supabase
      .from('justdial_leads')
      .select('id, raw_payload')
      .eq('id', leadId)
      .maybeSingle();

    const existingPayload = (existingLead?.raw_payload && typeof existingLead.raw_payload === 'object')
      ? existingLead.raw_payload
      : {};

    const updatedCrmSyncMeta = {
      status: result.status,
      crm_lead_id: result.crmLeadId || null,
      synced_at: result.status === 'synced' ? nowIso : null,
      error: result.error || null,
      last_attempt_at: nowIso,
    };

    const updatedPayload = {
      ...existingPayload,
      crm_sync: updatedCrmSyncMeta,
    };

    // 2. Try updating first-class columns along with raw_payload
    const updateObj: Record<string, any> = {
      raw_payload: updatedPayload,
      crm_sync_status: result.status,
      crm_lead_id: result.crmLeadId || null,
      crm_synced_at: result.status === 'synced' ? nowIso : null,
      crm_sync_error: result.error || null,
      updated_at: nowIso,
    };

    const { error: fullUpdateErr } = await supabase
      .from('justdial_leads')
      .update(updateObj)
      .eq('id', leadId);

    // If columns do not exist in PostgreSQL yet, fall back to updating raw_payload only
    if (fullUpdateErr && fullUpdateErr.message?.includes('column')) {
      await supabase
        .from('justdial_leads')
        .update({
          raw_payload: updatedPayload,
          updated_at: nowIso,
        })
        .eq('id', leadId);
    }
  } catch (err: any) {
    console.error(`[Budget AI CRM Service] Failed to record sync status in database for lead ${leadId}:`, err?.message || err);
  }
}

/**
 * Synchronizes a single Justdial lead record to Budget AI Studio CRM.
 */
export async function syncLeadToBudgetAi(
  lead: any,
  options: { timeoutMs?: number; isDuplicatePhone?: boolean } = {}
): Promise<CrmSyncResult> {
  const apiKey =
    (typeof process !== 'undefined' && process.env.BUDGET_AI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.BUDGET_AI_API_KEY) ||
    '';

  if (!apiKey) {
    const errorMsg = 'Configuration Error: BUDGET_AI_API_KEY is not defined in server environment';
    console.error(`[Budget AI CRM] ${errorMsg}`);
    const result: CrmSyncResult = { success: false, status: 'failed', error: errorMsg };
    if (lead.id) await updateLeadSyncStatusInDb(lead.id, result);
    return result;
  }

  // 1. Map fields & validate required phone
  const { payload, validationError } = mapJustdialToCrmPayload(lead, options.isDuplicatePhone);
  if (validationError || !payload) {
    const result: CrmSyncResult = {
      success: false,
      status: 'failed',
      error: validationError || 'Validation error',
    };
    if (lead.id) await updateLeadSyncStatusInDb(lead.id, result);
    return result;
  }

  // 2. Perform HTTP POST to Budget AI Studio CRM API
  const timeoutMs = options.timeoutMs || 4000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`[Budget AI CRM] Sending lead ${lead.leadid || lead.id} to ${CRM_API_URL}...`);

    const response = await fetch(CRM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    const responseText = await response.text();
    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (response.ok) {
      // Extract CRM Lead ID (e.g. from lead.id, data.id, id, lead_id, or crm_id)
      const crmLeadId =
        responseData?.lead?.id ||
        responseData?.id ||
        responseData?.data?.id ||
        responseData?.lead_id ||
        responseData?.leadId ||
        `CRM-${lead.leadid || Date.now()}`;

      console.log(`[Budget AI CRM] Successfully synced lead ${lead.leadid || lead.id}. CRM Lead ID: ${crmLeadId}`);

      const result: CrmSyncResult = {
        success: true,
        status: 'synced',
        crmLeadId: String(crmLeadId),
      };

      if (lead.id) await updateLeadSyncStatusInDb(lead.id, result);
      return result;
    } else {
      const errorMsg = `HTTP ${response.status} ${response.statusText}: ${responseData?.error || responseData?.message || responseText || 'Unknown CRM error'}`;
      console.error(`[Budget AI CRM] Lead sync failed for ${lead.leadid || lead.id}: ${errorMsg}`);

      const result: CrmSyncResult = {
        success: false,
        status: 'failed',
        error: errorMsg,
      };

      if (lead.id) await updateLeadSyncStatusInDb(lead.id, result);
      return result;
    }
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err?.name === 'AbortError';
    const errorMsg = isTimeout
      ? `CRM Request Timeout (exceeded ${timeoutMs}ms)`
      : `Network Error: ${err?.message || 'Connection failure'}`;

    console.error(`[Budget AI CRM] Exception syncing lead ${lead.leadid || lead.id}:`, errorMsg);

    const result: CrmSyncResult = {
      success: false,
      status: 'failed',
      error: errorMsg,
    };

    if (lead.id) await updateLeadSyncStatusInDb(lead.id, result);
    return result;
  }
}
