"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase-admin";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Modo desarrollo sin Supabase configurado
    if (!supabaseUrl) {
      router.push("/admin/dashboard");
      return;
    }

    try {
      const supabase = createAdminBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F0D000] transition-colors"
          placeholder="admin@hccomercial.com"
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-1.5">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F0D000] transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F0D000] hover:bg-[#F0D000]/90 text-[#0A0A0A] font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 tracking-wider"
      >
        {loading ? "INGRESANDO..." : "INGRESAR"}
      </button>
    </form>
  );
}
