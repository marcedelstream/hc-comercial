import Link from "next/link";
import { formatPrice } from "@/utils/formatePrice";

export default function HeroBannerItem({ bannerItem }: { bannerItem: any }) {
  return (
    <div className="relative w-full px-6 bg-white border rounded-2xl border-gray-2">
      <div className="flex items-center justify-between gap-5">
        <div className="w-1/2">
          <div className="pt-5 mb-10">
            <h2 className="max-w-[153px] font-semibold text-dark text-xl hover:text-blue">
              <Link href={`/products/${bannerItem?.product?.slug}`}>
                {bannerItem.bannerName}
              </Link>
            </h2>
            <p className="text-sm text-dark-3">{bannerItem?.subtitle}</p>
          </div>
          <div className="pb-6">
            <p className="font-medium text-dark-4 text-xs mb-1.5 uppercase">
              Oferta especial
            </p>
            <span className="flex items-center gap-2.5">
              <span className="font-bold text-heading-5 text-dark">
                {formatPrice(
                  bannerItem?.product?.discountedPrice
                    ? bannerItem?.product?.discountedPrice
                    : bannerItem?.product?.price
                )}
              </span>
              {bannerItem?.product?.discountedPrice && (
                <span className="text-2xl font-medium line-through text-dark-4">
                  {formatPrice(bannerItem?.product?.price)}
                </span>
              )}
            </span>
          </div>
        </div>
        {/* Placeholder imagen */}
        <div className="w-1/2 flex items-center justify-center py-4">
          <div className="bg-gray-2 rounded-xl flex flex-col items-center justify-center w-[120px] h-[140px]">
            <svg className="text-gray-4 mb-2" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-5 text-xs font-medium">Sin imagen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
