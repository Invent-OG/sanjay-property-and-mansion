import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';

export const prerender = false;

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
};

export const GET: APIRoute = async ({ request, url }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };

  try {
    // 1. Authentication check via Authorization: Bearer <BUDGET_AI_API_KEY>
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Missing or invalid Authorization header. Expected: Authorization: Bearer <BUDGET_AI_API_KEY>',
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const providedKey = authHeader.replace(/^Bearer\s+/i, '').trim();
    const expectedKey =
      (typeof process !== 'undefined' && process.env.BUDGET_AI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.BUDGET_AI_API_KEY);

    if (!expectedKey || providedKey !== expectedKey) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid API key.',
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // 2. Query Supabase justdial_leads table using privileged server client
    const supabase = getSupabaseServerClient();

    // Allow optional status filter via query param if needed (defaulting to 'new')
    const statusParam = (url.searchParams.get('status') || 'new').toLowerCase();

    let query = supabase
      .from('justdial_leads')
      .select(`
        id,
        leadid,
        leadtype,
        prefix,
        name,
        mobile,
        phone,
        email,
        lead_date,
        lead_time,
        category,
        city,
        area,
        brancharea,
        company,
        pincode,
        source,
        status,
        created_at
      `)
      .eq('source', 'justdial')
      .not('leadid', 'ilike', 'TEST%')
      .order('created_at', { ascending: false });

    if (statusParam !== 'all') {
      query = query.ilike('status', statusParam);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      console.error('[Budget AI API] Database query failed:', dbError.message);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'Failed to query leads from database.',
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // 3. Transform database rows to Budget AI expected lead format
    const leads = (data || []).map((lead) => {
      // Build location string from area, city, pincode
      const locationParts = [lead.area, lead.city, lead.pincode].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(', ') : '';

      // Build description from category and company
      const descriptionParts = [lead.category, lead.company].filter(Boolean);
      const description = descriptionParts.length > 0 ? descriptionParts.join(' - ') : (lead.category || lead.company || '');

      // Build structured notes from raw lead details without exposing raw_payload
      const notesParts = [
        lead.leadid ? `Lead ID: ${lead.leadid}` : null,
        lead.leadtype ? `Type: ${lead.leadtype}` : null,
        lead.category ? `Category: ${lead.category}` : null,
        lead.brancharea ? `Branch: ${lead.brancharea}` : null,
        lead.lead_time ? `Time: ${lead.lead_time}` : null,
      ].filter(Boolean);
      const notes = notesParts.join(' | ');

      const leadReceivedDate =
        lead.lead_date ||
        (lead.created_at ? String(lead.created_at).split('T')[0] : '');

      return {
        id: lead.leadid || lead.id || '',
        companyName: lead.company || '',
        fullName: lead.name || '',
        phoneNumber: lead.mobile || lead.phone || '',
        email: lead.email || '',
        leadStatus: lead.status || 'new',
        source: lead.source || 'justdial',
        leadReceivedDate,
        need: lead.category || '',
        requirement: lead.category || '',
        shortRequirement: lead.category || '',
        city: lead.city || '',
        location,
        address: location,
        industry: lead.category || '',
        description,
        notes,
      };
    });

    return new Response(
      JSON.stringify({ leads }, null, 2),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    console.error('[Budget AI API] Unexpected error:', err?.message || err);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while processing the request.',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
