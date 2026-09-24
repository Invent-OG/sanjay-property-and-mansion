-- =============================================================================
-- Migration: Create Justdial Leads Table
-- Purpose: Ingestion, storage, and CRM management of Justdial leads
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.justdial_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leadid VARCHAR(255) UNIQUE NOT NULL,
    leadtype VARCHAR(255),
    prefix VARCHAR(10),
    name VARCHAR(255),
    mobile VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    lead_date DATE,
    category VARCHAR(255),
    city VARCHAR(255),
    area VARCHAR(255),
    brancharea VARCHAR(255),
    dncmobile INTEGER DEFAULT 0,
    dncphone INTEGER DEFAULT 0,
    company VARCHAR(255),
    pincode VARCHAR(50),
    lead_time TIME,
    branchpin VARCHAR(50),
    parentid VARCHAR(255),
    source VARCHAR(50) DEFAULT 'justdial',
    status VARCHAR(50) DEFAULT 'new',
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup, filtering, and reporting
CREATE UNIQUE INDEX IF NOT EXISTS idx_justdial_leads_leadid ON public.justdial_leads (leadid);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_mobile ON public.justdial_leads (mobile);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_email ON public.justdial_leads (email);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_status ON public.justdial_leads (status);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_lead_date ON public.justdial_leads (lead_date DESC);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_created_at ON public.justdial_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_category ON public.justdial_leads (category);

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_justdial_leads_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_justdial_leads_updated_at ON public.justdial_leads;
CREATE TRIGGER trg_justdial_leads_updated_at
BEFORE UPDATE ON public.justdial_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_justdial_leads_timestamp();

-- Enable Row Level Security
ALTER TABLE public.justdial_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Deny public anonymous access completely
DROP POLICY IF EXISTS "Deny anon access on justdial_leads" ON public.justdial_leads;
CREATE POLICY "Deny anon access on justdial_leads"
ON public.justdial_leads
FOR ALL
TO anon
USING (false);

-- RLS Policy: Allow authenticated admin users to read leads
DROP POLICY IF EXISTS "Allow authenticated read on justdial_leads" ON public.justdial_leads;
CREATE POLICY "Allow authenticated read on justdial_leads"
ON public.justdial_leads
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Allow authenticated admin users to update leads (status, notes, etc.)
DROP POLICY IF EXISTS "Allow authenticated update on justdial_leads" ON public.justdial_leads;
CREATE POLICY "Allow authenticated update on justdial_leads"
ON public.justdial_leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policy: Allow authenticated admin users to delete leads if needed
DROP POLICY IF EXISTS "Allow authenticated delete on justdial_leads" ON public.justdial_leads;
CREATE POLICY "Allow authenticated delete on justdial_leads"
ON public.justdial_leads
FOR DELETE
TO authenticated
USING (true);
