import Link from "next/link";

const quickLinks = [
  { id: 1, label: "Política de privacidad", href: "#" },
  { id: 2, label: "Términos y condiciones", href: "#" },
  { id: 3, label: "Preguntas frecuentes", href: "#" },
  { id: 4, label: "Contacto", href: "#" },
];

export default function QuickLinks() {
  return (
    <div className="w-full sm:w-auto">
      <h2 className="mb-7.5 text-xl font-semibold text-dark">Enlaces</h2>

      <ul className="flex flex-col gap-3">
        {quickLinks.map((link) => (
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
