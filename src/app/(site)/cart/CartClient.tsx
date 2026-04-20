"use client";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatePrice";
import Link from "next/link";

export default function CartClient() {
  const { cartDetails, totalPrice, removeItem, incrementItem: incrementQuantity, decrementItem: decrementQuantity } = useCart();
  const items = Object.values(cartDetails ?? {});

  if (items.length === 0) {
    return (
      <main className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
          <h1 className="text-3xl font-bold text-dark mb-8">Carrito de compras</h1>
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="text-gray-4 mx-auto" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-dark mb-3">Tu carrito está vacío</h2>
            <p className="text-dark-3 mb-6">Explorá nuestra tienda y encontrá el equipo ideal para tu negocio.</p>
            <Link
              href="/shop"
              className="inline-flex font-semibold text-dark bg-blue px-8 py-3 rounded-xl hover:bg-blue-dark ease-out duration-200"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark">Carrito de compras</h1>
          <span className="text-dark-3 text-sm">{items.length} producto{items.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white border border-gray-3 rounded-2xl p-4 sm:p-5"
              >
                {/* Imagen placeholder */}
                <div className="bg-gray-2 rounded-xl flex flex-col items-center justify-center w-[90px] h-[90px] shrink-0">
                  <svg className="text-gray-4" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-5 text-[10px] mt-1">Sin imagen</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-sm font-semibold text-dark hover:text-blue line-clamp-2 mb-1 block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-dark-4 mb-3">
                    Precio unitario: {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Cantidad */}
                    <div className="flex items-center border border-gray-3 rounded-lg overflow-hidden">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2.5 py-1.5 text-dark hover:bg-gray-2 text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-dark text-sm font-medium min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2.5 py-1.5 text-dark hover:bg-gray-2 text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-dark">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Link
                href="/shop"
                className="text-sm text-dark-3 hover:text-blue flex items-center gap-1"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-3 rounded-2xl p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-dark mb-5">Resumen</h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-dark-3 line-clamp-1 max-w-[160px]">{item.name} x{item.quantity}</span>
                    <span className="text-dark font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-3 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-dark-3">Subtotal</span>
                  <span className="text-sm font-medium text-dark">{formatPrice(totalPrice ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-dark-3">Envío</span>
                  <span className="text-sm text-dark-4">Se calcula al finalizar</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-dark border-t border-gray-3 pt-3">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice ?? 0)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 py-3.5 font-bold text-dark text-center bg-blue hover:bg-blue-dark rounded-xl ease-out duration-200"
              >
                Finalizar compra
              </Link>

              <Link
                href={`https://wa.me/595982800258?text=Hola! Quiero hacer un pedido por WhatsApp.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 py-3 font-semibold text-white bg-dark hover:bg-dark-2 rounded-xl ease-out duration-200 text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pedido por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
