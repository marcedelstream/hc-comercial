import Link from "next/link";

const accountLinks = [
  { id: 1, label: "Tienda", href: "/shop" },
  { id: 2, label: "Carrito", href: "/cart" },
  { id: 3, label: "Lista de deseos", href: "/wishlist" },
  { id: 4, label: "Checkout", href: "/checkout" },
];

export default function AccountLinks() {
  return (
    <div className="w-full sm:w-auto">
      <h2 className="mb-7.5 text-xl font-semibold text-dark">Navegación</h2>

      <ul className="flex flex-col gap-3.5">
        {accountLinks.map((link) => (
          <li key={link.id}>
            <Link
              className="text-base duration-200 ease-out hover:text-blue"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
