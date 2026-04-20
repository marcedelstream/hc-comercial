import { staticProducts, staticCategories } from "@/data/staticData";
import { formatPrice } from "@/utils/formatePrice";
import Link from "next/link";

export const metadata = {
  title: "Tienda | HC COMERCIAL",
  description: "Equipos gastronómicos de alta calidad. Freidoras, hornos, heladeras, batidoras y más.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category } = await searchParams;
  const allProducts = staticProducts;
  const products = category
    ? allProducts.filter((p) => p.category.slug === category)
    : allProducts;
  const categories = staticCategories;

  return (
    <main className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        {/* Encabezado */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark mb-2">Equipos Gastronómicos</h1>
          <p className="text-dark-3">
            {products.length} {products.length === 1 ? "producto" : "productos"} disponibles · Todos con garantía y envío a todo el Paraguay
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar categorías */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-3 rounded-2xl p-5 sticky top-28">
              <h2 className="text-base font-semibold text-dark mb-4">Categorías</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!category ? "text-blue font-semibold bg-gray-1" : "text-dark-3 hover:text-blue hover:bg-gray-1"}`}
                  >
                    Todos los productos ({allProducts.length})
                  </Link>
                </li>
                {categories.map((cat) => {
                  const count = allProducts.filter(
                    (p) => p.category.slug === cat.slug
                  ).length;
                  const isActive = category === cat.slug;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className={`flex justify-between items-center text-sm py-1.5 px-3 rounded-lg transition-colors ${isActive ? "text-blue font-semibold bg-gray-1" : "text-dark-3 hover:text-blue hover:bg-gray-1"}`}
                      >
                        <span>{cat.title}</span>
                        <span className="text-xs text-gray-5 bg-gray-2 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-3">
                <h2 className="text-base font-semibold text-dark mb-4">¿Necesitás asesoramiento?</h2>
                <Link
                  href="https://wa.me/595982800258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full py-2.5 px-4 bg-blue text-dark font-semibold text-sm rounded-lg hover:bg-blue-dark ease-out duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultá por WhatsApp
                </Link>
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
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
                    {product.discountedPrice && (
                      <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-dark bg-blue rounded-full">
                        {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                      </span>
                    )}
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
                    <p className="text-xs text-dark-3 line-clamp-2 mb-3">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-dark">
                        {formatPrice(product.discountedPrice ?? product.price)}
                      </span>
                      {product.discountedPrice && (
                        <span className="text-xs line-through text-dark-4">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
