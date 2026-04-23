export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default async function PedidosPage() {
  let orders: Order[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, total, status, created_at")
        .order("created_at", { ascending: false });
      orders = data ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">PEDIDOS</h1>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">ID</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Cliente</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Email</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Total</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Estado</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#1F1F1F] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{o.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-white font-medium">{o.customer_name}</td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{o.customer_email}</td>
                <td className="px-4 py-3 text-right text-white">Gs. {(o.total ?? 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-500/20 text-gray-400"}`}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-400 text-xs hidden md:table-cell">
                  {new Date(o.created_at).toLocaleDateString("es-PY")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">No hay pedidos aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
