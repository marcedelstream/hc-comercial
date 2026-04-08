import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* Banner grande */}
        <div className="relative z-1 overflow-hidden rounded-2xl bg-dark py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block mb-3 text-xl font-medium text-blue">
              Cámara Frigorífica CF-8m3
            </span>
            <h2 className="mb-5 text-xl font-semibold lg:text-heading-4 xl:text-heading-3 text-white">
              HASTA 8% DE DESCUENTO
            </h2>
            <p className="text-gray-4">
              Conservación profesional para carnes, lácteos y frescos. Paneles de alta eficiencia con alarma de temperatura incluida.
            </p>
            <Link
              href="/products/camara-frigorifica-cf-8m3"
              className="inline-flex font-semibold text-custom-sm text-dark bg-blue py-3 px-7 rounded-lg ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Ver producto
            </Link>
          </div>
          {/* Placeholder imagen */}
          <div className="absolute bottom-0 right-4 lg:right-26 -z-1 hidden sm:flex items-end justify-center">
            <div className="bg-gray-7 rounded-t-xl flex flex-col items-center justify-center w-[300px] h-[260px]">
              <svg className="text-gray-5 mb-2" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-5 text-sm font-medium">Sin imagen</span>
            </div>
          </div>
        </div>

        {/* Banners pequeños */}
        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          <div className="relative z-1 overflow-hidden rounded-2xl bg-gray-2 py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <div>
              <span className="block text-lg text-dark mb-1.5">Cocina Industrial CI-600</span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Equipá tu cocina
              </h2>
              <p className="text-lg font-medium text-blue">6 hornallas profesionales</p>
              <Link
                href="/products/cocina-industrial-6-hornallas-ci-600"
                className="inline-flex font-medium text-custom-sm text-white bg-dark hover:bg-dark-2 py-3 px-7 rounded-lg ease-out duration-200 mt-7.5"
              >
                Ver producto
              </Link>
            </div>
          </div>

          <div className="relative z-1 overflow-hidden rounded-2xl bg-gray-2 py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <div>
              <span className="block text-lg text-dark mb-1.5">Freidora Industrial FI-2000</span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Frituras perfectas
              </h2>
              <p className="text-lg font-medium text-blue">11% de descuento</p>
              <Link
                href="/products/freidora-industrial-fi-2000"
                className="inline-flex font-medium text-custom-sm text-white bg-dark hover:bg-dark-2 py-3 px-7 rounded-lg ease-out duration-200 mt-7.5"
              >
                Ver producto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
