"use client";

import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({ images, alt }: Props) {
  const valid = images.filter(Boolean);
  const [selected, setSelected] = useState(0);

  if (valid.length === 0) {
    return (
      <div className="bg-gray-2 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
        <svg className="text-gray-4 mb-3" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-gray-5 text-base font-medium">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="bg-gray-2 rounded-2xl flex items-center justify-center min-h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={valid[selected]} alt={alt} className="w-full h-full object-contain p-6" />
      </div>

      {/* Miniaturas — solo si hay más de una */}
      {valid.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {valid.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden bg-gray-2 border-2 transition-colors ${
                selected === i
                  ? "border-blue"
                  : "border-transparent hover:border-gray-4"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
