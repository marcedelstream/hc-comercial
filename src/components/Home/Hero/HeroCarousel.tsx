"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css/pagination";
import "swiper/css";

import Link from "next/link";

const HeroCarousal = ({ sliders }: { sliders: any[] }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {sliders?.map((slider: any, key: number) => (
        <SwiperSlide key={key}>
          <div className="flex flex-col-reverse items-center pt-6 sm:pt-0 sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              {slider?.discountRate > 0 && (
                <div className="flex items-center gap-4 mb-5">
                  <span className="block font-semibold text-heading-3 sm:text-[58px] text-blue">
                    {slider?.discountRate}%
                  </span>
                  <span className="block text-sm uppercase text-dark sm:text-xl sm:leading-6">
                    Desc.<br />Especial
                  </span>
                </div>
              )}

              <h1 className="mb-3 text-xl font-semibold text-dark sm:text-3xl">
                <Link href={slider?.product?.slug?.startsWith('/') ? slider.product.slug : `/products/${slider?.product?.slug}`}>
                  {slider?.product?.title}
                </Link>
              </h1>

              <p className="text-base text-meta-3">
                {slider?.product?.shortDescription?.slice(0, 100)}
              </p>

              <Link
                href={slider?.product?.slug?.startsWith('/') ? slider.product.slug : `/products/${slider?.product?.slug}`}
                className="inline-flex py-3 mt-10 font-semibold text-dark duration-200 ease-out rounded-lg text-custom-sm bg-blue px-9 hover:bg-blue-dark"
              >
                Ver Producto
              </Link>
            </div>

            {/* Placeholder imagen */}
            <div className="w-1/2 flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
              <div className="bg-gray-2 rounded-xl flex flex-col items-center justify-center w-[200px] h-[220px] sm:w-[280px] sm:h-[300px]">
                <svg className="text-gray-4 mb-3" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-5 text-sm font-medium">Sin imagen</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
