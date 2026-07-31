import CheckoutClient from "./CheckoutClient";

export const metadata: import('next').Metadata = {
  title: "Checkout | HC COMERCIAL",
  description: "Finalizá tu compra de equipos gastronómicos con Bancard.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
