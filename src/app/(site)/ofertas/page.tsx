import { staticProducts } from "@/data/staticData";
import { formatPrice } from "@/utils/formatePrice";
import Link from "next/link";

export const metadata = {
  title: "Ofertas | HC COMERCIAL",
  description: "Productos en promoción con descuento. Equipos gastronómicos al mejor precio.",
};

export default function OfertasPage() {
  const ofertas = staticProducts.filter((p) => p.discountedPrice && p.discountedPrice > 0);

  return (
    <main className="pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        {/* Encabezado */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark mb-2">Ofertas de nuestra tienda</h1>
          <p className="text-dark-3">Conocé los productos en promoción</p>
        </div>

        {ofertas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-3 text-lg mb-4">No hay ofertas disponibles en este momento.</p>
            <Link
              href="/shop"
              className="inline-flex font-semibold text-dark bg-blue px-8 py-3 rounded-xl hover:bg-blue-dark ease-out duration-200"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {ofertas.map((product) => {
              const descuento = Math.round(
                ((product.price - product.discountedPrice!) / product.price) * 100
              );
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block border border-gray-3 rounded-2xl overflow-hidden hover:border-blue hover:shadow-2 transition-all duration-200"
                >
                  {/* Imagen placeholder */}
                  <div className="bg-gray-2 flex flex-col items-center justify-center h-[200px] relative">
                    <svg className="text-gray-4 mb-2" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-5 text-sm">Sin imagen</span>
                    <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-dark bg-blue rounded-full">
                      {descuento}% OFF
                    </span>
                    {product.quantity < 1 && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white bg-red rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-blue font-medium uppercase mb-1">
                      {product.category.title}
                    </p>
                    <h3 className="text-sm font-semibold text-dark group-hover:text-blue line-clamp-2 mb-2 transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-dark">
                        {formatPrice(product.discountedPrice!)}
                      </span>
                      <span className="text-xs line-through text-dark-4">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
