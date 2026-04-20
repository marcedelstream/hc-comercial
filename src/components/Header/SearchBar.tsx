"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staticProducts, staticCategories } from "@/data/staticData";
import { formatPrice } from "@/utils/formatePrice";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = query.trim().length >= 2
    ? staticProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const categoryResults = query.trim().length >= 2
    ? staticCategories.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = results.length > 0 || categoryResults.length > 0;

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowInput(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setShowInput(false);
      setQuery("");
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setShowInput(false);
      setQuery("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.trim().length >= 2);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setShowInput(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: input siempre visible */}
      <div className="hidden xl:flex items-center gap-2 bg-gray-1 border border-gray-3 rounded-xl px-3 py-2 w-[220px] focus-within:border-blue focus-within:bg-white transition-all">
        <svg width="18" height="18" viewBox="0 0 25 25" fill="currentColor" className="text-gray-5 shrink-0">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.834 4.92566C15.6448 4.92584 18.7334 8.0146 18.7334 11.8241C18.7333 15.6335 15.6447 18.7223 11.834 18.7225C8.0231 18.7225 4.93371 15.6336 4.93359 11.8241C4.93359 8.01448 8.02302 4.92566 11.834 4.92566ZM18.2788 17.21C19.4989 15.752 20.2333 13.8738 20.2334 11.8241C20.2334 7.18583 16.4729 3.42584 11.834 3.42566C7.19493 3.42566 3.43359 7.18572 3.43359 11.8241C3.43371 16.4624 7.19501 20.2225 11.834 20.2225C13.8827 20.2225 15.7601 19.489 17.218 18.2704L20.3018 21.3551L20.3594 21.4068C20.654 21.6468 21.0888 21.6296 21.3633 21.3551C21.6378 21.0804 21.6545 20.6457 21.4141 20.3512L21.3633 20.2945L18.2788 17.21Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Buscar productos..."
          className="bg-transparent text-sm text-dark placeholder-gray-5 outline-none w-full"
        />
      </div>

      {/* Mobile: ícono que despliega el input */}
      <div className="flex xl:hidden items-center">
        {showInput ? (
          <div className="flex items-center gap-2 bg-gray-1 border border-gray-3 rounded-xl px-3 py-2 w-[180px] focus-within:border-blue focus-within:bg-white transition-all">
            <svg width="18" height="18" viewBox="0 0 25 25" fill="currentColor" className="text-gray-5 shrink-0">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.834 4.92566C15.6448 4.92584 18.7334 8.0146 18.7334 11.8241C18.7333 15.6335 15.6447 18.7223 11.834 18.7225C8.0231 18.7225 4.93371 15.6336 4.93359 11.8241C4.93359 8.01448 8.02302 4.92566 11.834 4.92566ZM18.2788 17.21C19.4989 15.752 20.2333 13.8738 20.2334 11.8241C20.2334 7.18583 16.4729 3.42584 11.834 3.42566C7.19493 3.42566 3.43359 7.18572 3.43359 11.8241C3.43371 16.4624 7.19501 20.2225 11.834 20.2225C13.8827 20.2225 15.7601 19.489 17.218 18.2704L20.3018 21.3551L20.3594 21.4068C20.654 21.6468 21.0888 21.6296 21.3633 21.3551C21.6378 21.0804 21.6545 20.6457 21.4141 20.3512L21.3633 20.2945L18.2788 17.21Z" />
        </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
              placeholder="Buscar..."
              className="bg-transparent text-sm text-dark placeholder-gray-5 outline-none w-full"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="text-gray-700 hover:text-blue transition"
            aria-label="Buscar"
          >
            <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.834 4.92566C15.6448 4.92584 18.7334 8.0146 18.7334 11.8241C18.7333 15.6335 15.6447 18.7223 11.834 18.7225C8.0231 18.7225 4.93371 15.6336 4.93359 11.8241C4.93359 8.01448 8.02302 4.92566 11.834 4.92566ZM18.2788 17.21C19.4989 15.752 20.2333 13.8738 20.2334 11.8241C20.2334 7.18583 16.4729 3.42584 11.834 3.42566C7.19493 3.42566 3.43359 7.18572 3.43359 11.8241C3.43371 16.4624 7.19501 20.2225 11.834 20.2225C13.8827 20.2225 15.7601 19.489 17.218 18.2704L20.3018 21.3551L20.3594 21.4068C20.654 21.6468 21.0888 21.6296 21.3633 21.3551C21.6378 21.0804 21.6545 20.6457 21.4141 20.3512L21.3633 20.2945L18.2788 17.21Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && hasResults && (
        <div className="absolute right-0 xl:left-0 top-full mt-2 w-[320px] bg-white border border-gray-3 rounded-2xl shadow-2 z-50 overflow-hidden">
          {categoryResults.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-semibold text-gray-5 uppercase tracking-wider mb-2">Categorías</p>
              {categoryResults.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-1 text-sm text-dark hover:text-blue transition-colors"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className={`px-4 pb-3 ${categoryResults.length > 0 ? "pt-1 border-t border-gray-2 mt-1" : "pt-3"}`}>
              <p className="text-xs font-semibold text-gray-5 uppercase tracking-wider mb-2">Productos</p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={handleResultClick}
                  className="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-1 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark group-hover:text-blue line-clamp-1">{product.title}</p>
                    <p className="text-xs text-gray-5">{product.category.title} · SKU: {product.sku}</p>
                  </div>
                  <span className="text-sm font-bold text-dark shrink-0">
                    {formatPrice(product.discountedPrice ?? product.price)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && !hasResults && query.trim().length >= 2 && (
        <div className="absolute right-0 xl:left-0 top-full mt-2 w-[280px] bg-white border border-gray-3 rounded-2xl shadow-2 z-50 px-4 py-4 text-center">
          <p className="text-sm text-dark-3">Sin resultados para <strong>"{query}"</strong></p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
