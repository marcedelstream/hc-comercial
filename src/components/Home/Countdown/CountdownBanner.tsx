"use client";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";

interface CountdownBannerProps {
  data: any;
}

const CountdownBanner = ({ data }: CountdownBannerProps) => {
  if (!data) return null;

  const productHref = data?.product?.href ?? null;

  return (
    <section className="py-20 overflow-hidden">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-xl bg-dark p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            <span className="block font-medium text-blue mb-2.5">
              {data.subtitle}
            </span>

            <h2 className="mb-3 text-xl font-semibold text-white lg:text-heading-4 xl:text-heading-3">
              {data.title}
            </h2>

            {data?.product?.title && (
              productHref ? (
                <Link href={productHref} className="text-base font-normal text-gray-4 hover:text-blue">
                  {data.product.title}
                </Link>
              ) : (
                <p className="text-base font-normal text-gray-4">
                  {data.product.title}
                </p>
              )
            )}

            <CountdownTimer targetDate={data?.endDate} />

            <Link
              href={productHref ?? '/shop'}
              className="inline-flex font-semibold text-custom-sm text-dark bg-blue py-3 px-9.5 rounded-lg ease-out duration-200 hover:bg-blue-dark mt-8"
            >
              ¡Ver oferta!
            </Link>
          </div>

          {/* Placeholder decorativo */}
          <div className="absolute hidden lg:flex right-4 xl:right-33 bottom-4 xl:bottom-14 -z-1 items-center justify-center">
            <div className="bg-gray-7 rounded-xl flex flex-col items-center justify-center w-[200px] h-[220px]">
              <svg className="text-gray-5 mb-2" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-5 text-sm font-medium">Sin imagen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownBanner;
