import { staticProducts, getProductBySlug, getRelatedProducts } from "@/data/staticData";
import { notFound } from "next/navigation";
import { formatPrice } from "@/utils/formatePrice";
import ProductActions from "./ProductActions";
import ShippingCalculator from "./ShippingCalculator";
import Link from "next/link";

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | HC COMERCIAL" };
  return {
    title: `${product.title} | HC COMERCIAL`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(slug, 4);

  return (
    <main className="pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-dark-4">
          <Link href="/" className="hover:text-blue">Inicio</Link>
          {" / "}
          <Link href="/shop" className="hover:text-blue">Tienda</Link>
          {" / "}
          <span className="text-dark">{product.title}</span>
        </nav>

        {/* Producto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagen placeholder */}
          <div className="bg-gray-2 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
            <svg className="text-gray-4 mb-3" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-5 text-base font-medium">Sin imagen</span>
          </div>

          {/* Info */}
          <div>
            <div className="mb-2">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-sm text-blue font-medium uppercase tracking-wide hover:underline"
              >
                {product.category.title}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
              {product.title}
            </h1>

            <p className="text-dark-3 mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-dark">
                {formatPrice(product.discountedPrice ?? product.price)}
              </span>
              {product.discountedPrice && (
                <>
                  <span className="text-xl line-through text-dark-4">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 text-xs font-bold text-dark bg-blue rounded-full">
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* SKU y stock */}
            <div className="flex gap-6 text-sm text-dark-4 mb-6">
              <span>SKU: <strong className="text-dark">{product.sku}</strong></span>
              <span>
                Stock:{" "}
                <strong className={product.quantity > 0 ? "text-green" : "text-red"}>
                  {product.quantity > 0 ? `${product.quantity} unidades` : "Sin stock"}
                </strong>
              </span>
            </div>

            {/* Acciones (client component) */}
            <ProductActions product={product} />

            {/* Cotizador de flete */}
            <ShippingCalculator />

            {/* WhatsApp */}
            <div className="mt-6 p-4 bg-gray-1 rounded-xl border border-gray-3">
              <p className="text-sm text-dark-3 mb-2">¿Tenés consultas sobre este producto?</p>
              <Link
                href={`https://wa.me/595982800258?text=Hola! Me interesa el producto: ${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-dark bg-blue px-5 py-2.5 rounded-lg hover:bg-blue-dark ease-out duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Descripción e información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Descripción */}
          <div className="bg-white border border-gray-3 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-dark mb-4">Descripción</h2>
            <div
              className="prose text-dark-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* Especificaciones técnicas */}
          {product.additionalInformation.length > 0 && (
            <div className="bg-white border border-gray-3 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-dark mb-4">Especificaciones técnicas</h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.additionalInformation.map((info, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-1" : ""}>
                      <td className="py-2 px-3 font-medium text-dark w-1/2 rounded-l">{info.name}</td>
                      <td className="py-2 px-3 text-dark-3 rounded-r">{info.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-dark mb-8">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group block border border-gray-3 rounded-xl p-4 hover:border-blue transition-colors"
                >
                  <div className="bg-gray-2 rounded-lg flex flex-col items-center justify-center h-[160px] mb-4">
                    <svg className="text-gray-4 mb-1" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-5 text-xs">Sin imagen</span>
                  </div>
                  <h3 className="text-sm font-semibold text-dark group-hover:text-blue line-clamp-2 mb-2">
                    {rel.title}
                  </h3>
                  <span className="text-sm font-bold text-dark">
                    {formatPrice(rel.discountedPrice ?? rel.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
