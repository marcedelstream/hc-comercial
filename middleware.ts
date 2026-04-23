import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // Sin Supabase configurado (desarrollo sin env vars) — dejar pasar todo
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cs) => {
        cs.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin";
  const isProtectedAdmin = pathname.startsWith("/admin/");

  // Tiene sesión y está en login → redirigir al dashboard
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Sin sesión e intenta acceder a ruta protegida → redirigir al login
  if (!user && isProtectedAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
