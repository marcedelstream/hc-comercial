import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-admin";
import AdminSidebar from "@/components/admin/sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl) {
    try {
      const supabase = await createAdminServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) redirect("/admin");
    } catch {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
