import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-admin";
import LoginForm from "./login-form";

export default async function AdminLoginPage() {
  // Si Supabase está configurado y hay sesión activa, ir al dashboard
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createAdminServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) redirect("/admin/dashboard");
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F0D000] tracking-widest mb-1">
            HC COMERCIAL
          </h1>
          <p className="text-gray-500 text-sm tracking-wider">PANEL DE ADMINISTRACIÓN</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
