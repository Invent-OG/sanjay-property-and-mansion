-- =============================================================================
-- MIGRATION: CREATE USERS TABLE & DEFAULT ADMIN LOGIN CREDENTIALS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Administrator',
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on users" ON public.users;
CREATE POLICY "Service role full access on users" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can read user by email for auth verification" ON public.users;
CREATE POLICY "Anon can read user by email for auth verification" 
ON public.users 
FOR SELECT 
TO anon 
USING (is_active = true);

INSERT INTO public.users (
    email,
    password_hash,
    name,
    role,
    is_active
) VALUES (
    'admin@sanjayproperties.in',
    '0d3e46c08846bb901d6479a11777d3b5:f1538d8179756a80382d6dea6db4724bcef75fa2dddb83944864ca42dfac86c35f13048fd315afcbc8d3e4c10750be36600826849029d5d2bbd1ec9409279083',
    'Administrator',
    'superadmin',
    true
)
ON CONFLICT (email) DO UPDATE SET
    role = 'superadmin',
    is_active = true,
    updated_at = NOW();

GRANT SELECT ON public.users TO anon;
GRANT ALL ON public.users TO service_role;
