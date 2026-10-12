import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';
import { syncLeadToBudgetAi } from '../../../../services/budgetAiCrmService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { leadId } = body;

    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Missing leadId parameter' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabaseServerClient();

    // Query lead by id (UUID) or leadid safely without Postgres syntax errors
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId);
    let query = supabase.from('justdial_leads').select('*');
    if (isUuid) {
      query = query.eq('id', leadId);
    } else {
      query = query.eq('leadid', leadId);
    }
    const { data: lead, error: dbError } = await query.maybeSingle();

    if (dbError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found in database', details: dbError?.message }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Check for duplicate phone in database
    const targetPhone = lead.mobile || lead.phone;
    let isDuplicatePhone = false;
    if (targetPhone) {
      try {
        const { count } = await supabase
          .from('justdial_leads')
          .select('id', { count: 'exact', head: true })
          .neq('leadid', lead.leadid)
          .or(`mobile.eq.${targetPhone},phone.eq.${targetPhone}`);
        isDuplicatePhone = Boolean(count && count > 0);
      } catch {
        // Ignored
      }
    }

    // Execute synchronization against Budget AI Studio CRM API
    const result = await syncLeadToBudgetAi(lead, {
      timeoutMs: 6000,
      isDuplicatePhone,
    });

    return new Response(
      JSON.stringify({
        success: result.success,
        status: result.status,
        crmLeadId: result.crmLeadId || null,
        error: result.error || null,
      }),
      { status: result.success ? 200 : 422, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[Retry Sync API] Unexpected error:', err?.message || err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: err?.message || err }),
      { status: 500, headers: corsHeaders }
    );
  }
};
