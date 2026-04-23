import { createBrowserClient, createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createAdminBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function createAdminServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cs) => {
        cs.forEach(({ name, value, options }) => {
          try { cookieStore.set(name, value, options); } catch {}
        });
      },
    },
  });
}

export async function createServiceRoleClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cs) => {
        cs.forEach(({ name, value, options }) => {
          try { cookieStore.set(name, value, options); } catch {}
        });
      },
    },
  });
}
