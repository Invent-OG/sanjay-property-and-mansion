-- =============================================================================
-- Migration: Add CRM Synchronization Columns to justdial_leads
-- Target: Budget AI Studio CRM Integration
-- =============================================================================

ALTER TABLE public.justdial_leads 
ADD COLUMN IF NOT EXISTS crm_sync_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS crm_lead_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS crm_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS crm_sync_error TEXT;

-- Create index for filtering by sync status and finding pending/failed leads
CREATE INDEX IF NOT EXISTS idx_justdial_leads_crm_sync_status ON public.justdial_leads (crm_sync_status);
CREATE INDEX IF NOT EXISTS idx_justdial_leads_crm_lead_id ON public.justdial_leads (crm_lead_id);
