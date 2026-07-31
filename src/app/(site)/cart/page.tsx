import CartClient from "./CartClient";

export const metadata: import('next').Metadata = {
  title: "Carrito | HC COMERCIAL",
  description: "Revisá y finalizá tu pedido de equipos gastronómicos.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClient />;
}
