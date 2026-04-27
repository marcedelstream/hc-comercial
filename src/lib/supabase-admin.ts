import { createClient } from '@supabase/supabase-js'

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? 'https://placeholder.supabase.co'
const anon    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
const service = process.env.SUPABASE_SERVICE_ROLE_KEY     ?? 'placeholder-service-key'

// Client para operaciones de servidor con privilegios completos (bypass RLS)
export const supabaseAdmin = createClient(url, service)

// Client para el storefront público (respeta RLS)
export const supabase = createClient(url, anon)
