import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';

export const prerender = false;

// Helper: Trim and truncate string within database column length limits
function cleanString(val: string | null | undefined, maxLen: number): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLen);
}

// Helper: Parse date safely into YYYY-MM-DD
function parseDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Standard Justdial format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed + 'T00:00:00Z');
    if (!isNaN(d.getTime())) return trimmed;
  }

  // Alternate format: DD-MM-YYYY or DD/MM/YYYY
  const ddmmyyyy = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (ddmmyyyy) {
    return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  }

  // Fallback: try parsing generic date
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return null;
}

// Helper: Parse time safely into HH:mm:ss
function parseTime(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  const trimmed = timeStr.trim();
  if (!trimmed) return null;

  // Match HH:mm:ss or HH:mm
  const m = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/);
  if (m) {
    const hh = m[1].padStart(2, '0');
    const mm = m[2];
    const ss = m[4] ? m[4] : '00';
    return `${hh}:${mm}:${ss}`;
  }

  return null;
}

// Helper: Parse DNC flags (0 or 1)
function parseDncFlag(val: string | null | undefined): number {
  if (!val) return 0;
  const trimmed = val.trim();
  return trimmed === '1' ? 1 : 0;
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;

    // Build raw payload dictionary preserving original parameter names & values
    const rawPayload: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      rawPayload[key] = value;
    }

    // Helper: case-insensitive query parameter retrieval
    const getParam = (paramName: string): string => {
      if (searchParams.has(paramName)) {
        return searchParams.get(paramName) || '';
      }
      for (const [k, v] of searchParams.entries()) {
        if (k.toLowerCase() === paramName.toLowerCase()) {
          return v || '';
        }
      }
      return '';
    };

    const rawLeadId = getParam('leadid');
    const leadid = cleanString(rawLeadId, 255);

    // Validation: leadid is required by Justdial specification
    if (!leadid) {
      console.warn('[Justdial] Lead rejected: Missing required leadid parameter');
      return new Response('ERROR: Missing leadid', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    console.log('[Justdial] Lead received');
    console.log(`[Justdial] Lead ID: ${leadid}`);

    // Extract & normalize all parameters according to database schema specifications
    const leadtype = cleanString(getParam('leadtype'), 255);
    const prefix = cleanString(getParam('prefix'), 10);
    const name = cleanString(getParam('name'), 255);
    const mobile = cleanString(getParam('mobile'), 50);
    const phone = cleanString(getParam('phone'), 50);
    const email = cleanString(getParam('email'), 255);
    const category = cleanString(getParam('category'), 255);
    const city = cleanString(getParam('city'), 255);
    const area = cleanString(getParam('area'), 255);
    const brancharea = cleanString(getParam('brancharea'), 255);
    const company = cleanString(getParam('company'), 255);
    const pincode = cleanString(getParam('pincode'), 50);
    const branchpin = cleanString(getParam('branchpin'), 50);
    const parentid = cleanString(getParam('parentid'), 255);

    const dncmobile = parseDncFlag(getParam('dncmobile'));
    const dncphone = parseDncFlag(getParam('dncphone'));

    const leadDate = parseDate(getParam('date'));
    const leadTime = parseTime(getParam('time'));

    // Server-side Supabase client using Service Role Key
    const supabase = getSupabaseServerClient();

    // Check for existing lead to maintain idempotency and preserve existing admin status
    const { data: existingLead } = await supabase
      .from('justdial_leads')
      .select('id, status')
      .eq('leadid', leadid)
      .maybeSingle();

    const currentStatus = existingLead?.status || 'new';

    const leadRecord = {
      leadid,
      leadtype,
      prefix,
      name,
      mobile,
      phone,
      email,
      lead_date: leadDate,
      lead_time: leadTime,
      category,
      city,
      area,
      brancharea,
      dncmobile,
      dncphone,
      company,
      pincode,
      branchpin,
      parentid,
      source: 'justdial',
      status: currentStatus,
      raw_payload: rawPayload,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from('justdial_leads')
      .upsert(leadRecord, { onConflict: 'leadid' });

    if (dbError) {
      console.error('[Justdial] Database upsert failed:', dbError.message);
      return new Response('ERROR: Database operation failed', {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (existingLead) {
      console.log(`[Justdial] Duplicate lead ${leadid} updated successfully`);
    } else {
      console.log(`[Justdial] Database insert successful for Lead ID: ${leadid}`);
    }

    // Exact response requirement: HTTP 200, Content-Type: text/plain, Body: RECEIVED
    return new Response('RECEIVED', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[Justdial] Unexpected error processing lead:', error?.message || error);
    return new Response('ERROR: Internal server error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};
