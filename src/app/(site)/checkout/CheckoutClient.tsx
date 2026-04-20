"use client";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatePrice";
import { departamentosParaguay } from "@/data/staticData";
import Link from "next/link";
import { useState } from "react";

type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  departamento: string;
  ciudad: string;
  // Bancard
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
};

export default function CheckoutClient() {
  const { cartDetails, totalPrice, clearCart } = useCart();
  const items = Object.values(cartDetails ?? {});
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    departamento: "",
    ciudad: "",
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const dept = departamentosParaguay.find((d) => d.nombre === form.departamento);
  const shippingCost = dept?.costoFlete ?? 0;
  const total = (totalPrice ?? 0) + shippingCost;

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.nombre.trim()) newErrors.nombre = "Requerido";
    if (!form.apellido.trim()) newErrors.apellido = "Requerido";
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = "Email inválido";
    if (!form.telefono.trim()) newErrors.telefono = "Requerido";
    if (!form.direccion.trim()) newErrors.direccion = "Requerido";
    if (!form.departamento) newErrors.departamento = "Seleccioná un departamento";
    if (!form.ciudad.trim()) newErrors.ciudad = "Requerido";
    if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = "Número de tarjeta inválido";
    if (!form.cardHolder.trim()) newErrors.cardHolder = "Requerido";
    if (!form.expiry.trim() || !form.expiry.match(/^\d{2}\/\d{2}$/))
      newErrors.expiry = "Formato MM/AA";
    if (!form.cvv.trim() || form.cvv.length < 3) newErrors.cvv = "CVV inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("processing");
    // Simular procesamiento de 2.5 segundos
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setStep("success");
    clearCart();
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Formatear vencimiento
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  if (step === "processing") {
    return (
      <main className="pt-8 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white border border-gray-3 rounded-2xl p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">Procesando pago...</h2>
            <p className="text-dark-3">Estamos procesando tu pago con Bancard. Por favor esperá.</p>
          </div>
        </div>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="pt-8 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white border border-gray-3 rounded-2xl p-12">
            <div className="w-20 h-20 bg-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">¡Pago exitoso!</h2>
            <p className="text-dark-3 mb-2">
              Gracias <strong>{form.nombre}</strong>, tu pedido fue confirmado.
            </p>
            <p className="text-dark-3 mb-6">
              Nos comunicaremos a <strong>{form.email}</strong> y <strong>{form.telefono}</strong> para coordinar el envío.
            </p>
            <div className="bg-gray-1 rounded-xl p-4 mb-6 text-left text-sm">
              <p className="font-semibold text-dark mb-2">Resumen del pedido:</p>
              <p className="text-dark-3">Total pagado: <strong className="text-dark">{formatPrice(total)}</strong></p>
              <p className="text-dark-3">Destino: <strong className="text-dark">{form.departamento} - {form.ciudad}</strong></p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center py-3 px-8 font-semibold text-dark bg-blue hover:bg-blue-dark rounded-lg ease-out duration-200"
              >
                Volver al inicio
              </Link>
              <Link
                href={`https://wa.me/595982800258?text=Hola! Acabo de realizar un pedido. Nombre: ${encodeURIComponent(form.nombre + ' ' + form.apellido)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-8 font-semibold text-white bg-dark hover:bg-dark-2 rounded-lg ease-out duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Confirmar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        <h1 className="text-2xl font-bold text-dark mb-8">Finalizar compra</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark-3 text-lg mb-4">Tu carrito está vacío.</p>
            <Link
              href="/shop"
              className="inline-flex font-semibold text-dark bg-blue px-8 py-3 rounded-lg hover:bg-blue-dark"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-2 space-y-6">
                {/* Datos personales */}
                <div className="bg-white border border-gray-3 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-dark mb-5">Datos de contacto</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre" error={errors.nombre}>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        placeholder="Tu nombre"
                        className={inputClass(!!errors.nombre)}
                      />
                    </Field>
                    <Field label="Apellido" error={errors.apellido}>
                      <input
                        type="text"
                        value={form.apellido}
                        onChange={(e) => handleChange("apellido", e.target.value)}
                        placeholder="Tu apellido"
                        className={inputClass(!!errors.apellido)}
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        className={inputClass(!!errors.email)}
                      />
                    </Field>
                    <Field label="Teléfono / WhatsApp" error={errors.telefono}>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => handleChange("telefono", e.target.value)}
                        placeholder="+595 9XX XXX XXX"
                        className={inputClass(!!errors.telefono)}
                      />
                    </Field>
                  </div>
                </div>

                {/* Dirección de envío */}
                <div className="bg-white border border-gray-3 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-dark mb-5">Dirección de envío</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Departamento" error={errors.departamento} className="sm:col-span-2">
                      <select
                        value={form.departamento}
                        onChange={(e) => handleChange("departamento", e.target.value)}
                        className={inputClass(!!errors.departamento)}
                      >
                        <option value="">-- Seleccioná el departamento --</option>
                        {departamentosParaguay.map((d) => (
                          <option key={d.nombre} value={d.nombre}>
                            {d.nombre}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Ciudad / Barrio" error={errors.ciudad}>
                      <input
                        type="text"
                        value={form.ciudad}
                        onChange={(e) => handleChange("ciudad", e.target.value)}
                        placeholder="Ciudad o barrio"
                        className={inputClass(!!errors.ciudad)}
                      />
                    </Field>
                    <Field label="Dirección" error={errors.direccion}>
                      <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => handleChange("direccion", e.target.value)}
                        placeholder="Calle, número, referencia"
                        className={inputClass(!!errors.direccion)}
                      />
                    </Field>
                  </div>
                  {dept && (
                    <div className="mt-4 p-3 bg-blue rounded-lg text-sm font-medium text-dark flex items-center justify-between">
                      <span>Costo de envío a {dept.nombre}:</span>
                      <span className="font-bold">{formatPrice(dept.costoFlete)}</span>
                    </div>
                  )}
                </div>

                {/* Pago Bancard */}
                <div className="bg-white border border-gray-3 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-semibold text-dark">Pago con Bancard</h2>
                    <div className="bg-dark text-blue font-bold text-sm px-3 py-1 rounded-md">
                      BANCARD
                    </div>
                  </div>

                  <div className="p-4 bg-gray-1 rounded-xl border border-gray-3 mb-5 text-sm text-dark-3">
                    <p className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pago seguro procesado por Bancard. <strong>Solo demo</strong> — no se cobra dinero real.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Número de tarjeta" error={errors.cardNumber} className="sm:col-span-2">
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) =>
                          handleChange("cardNumber", formatCardNumber(e.target.value))
                        }
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className={inputClass(!!errors.cardNumber) + " font-mono tracking-widest"}
                      />
                    </Field>
                    <Field label="Nombre en la tarjeta" error={errors.cardHolder} className="sm:col-span-2">
                      <input
                        type="text"
                        value={form.cardHolder}
                        onChange={(e) => handleChange("cardHolder", e.target.value.toUpperCase())}
                        placeholder="NOMBRE APELLIDO"
                        className={inputClass(!!errors.cardHolder) + " uppercase"}
                      />
                    </Field>
                    <Field label="Vencimiento (MM/AA)" error={errors.expiry}>
                      <input
                        type="text"
                        value={form.expiry}
                        onChange={(e) =>
                          handleChange("expiry", formatExpiry(e.target.value))
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                        className={inputClass(!!errors.expiry) + " font-mono"}
                      />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                      <input
                        type="password"
                        value={form.cvv}
                        onChange={(e) =>
                          handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="•••"
                        maxLength={4}
                        className={inputClass(!!errors.cvv) + " font-mono"}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-3 rounded-2xl p-6 sticky top-28">
                  <h2 className="text-lg font-semibold text-dark mb-5">Resumen del pedido</h2>

                  <ul className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-start gap-3 text-sm">
                        <div className="bg-gray-2 rounded-md flex items-center justify-center w-12 h-12 shrink-0">
                          <svg className="text-gray-4" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-dark line-clamp-2">{item.name}</p>
                          <p className="text-dark-4">x{item.quantity}</p>
                        </div>
                        <span className="font-semibold text-dark shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-3 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-dark-3">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-dark-3">
                      <span>Envío estimado</span>
                      <span>{shippingCost > 0 ? formatPrice(shippingCost) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-dark border-t border-gray-3 pt-2 mt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 font-bold text-dark bg-blue hover:bg-blue-dark rounded-xl ease-out duration-200 text-base"
                  >
                    Pagar con Bancard
                  </button>

                  <p className="text-xs text-dark-4 text-center mt-3">
                    Esta es una simulación. No se procesan pagos reales.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

// Helpers de UI
function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-4 py-2.5 text-sm text-dark bg-white focus:outline-none transition-colors ${
    hasError
      ? "border-red focus:border-red"
      : "border-gray-3 focus:border-blue"
  }`;
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-dark mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red mt-1">{error}</p>}
    </div>
  );
}
