"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { menuData } from "./menuData";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { CartIcon, MenuIcon, CloseIcon } from "./icons";
import SearchBar from "./SearchBar";

type IProps = {
  headerData?: any | null;
};

const TICKER_MSG1 = "\u00a0\u00a0\u00a0🚚 Envíos a todo el Paraguay · WhatsApp: +595982800258\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0";
const TICKER_MSG2 = "🎁 Envíos gratis desde Gs. 1.000.000\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0";
const TICKER_FULL = TICKER_MSG1 + TICKER_MSG2;

const MainHeader = ({ headerData }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { handleCartClick, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setNavigationOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tickerContent = headerData?.headerText
    ? `${headerData.headerText}\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0`
    : TICKER_FULL;

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-50 bg-white transition-all ease-in-out duration-300 ${
          stickyMenu ? "shadow-sm" : ""
        }`}
      >
        {/* Header Principal: logo + buscador + menú + carrito */}
        <div className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          <div className="flex items-center gap-4 py-3 xl:py-0">
            {/* Logo */}
            <Link className="block shrink-0 py-2" href="/">
              <Image
                src="/hc-comercial-logo.png"
                alt="HC COMERCIAL"
                width={130}
                height={85}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Buscador — ocupa el espacio del centro */}
            <div className="flex-1">
              <SearchBar />
            </div>

            {/* Menú Desktop + Carrito (lado derecho) */}
            <div className="hidden xl:flex items-center gap-4">
              <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
              <button
                className="relative text-gray-700 transition hover:text-blue focus:outline-none"
                onClick={handleCartClick}
                aria-label="Carrito"
              >
                <CartIcon />
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-dark bg-blue text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </button>
            </div>

            {/* Mobile: carrito + hamburger */}
            <div className="flex xl:hidden items-center gap-3">
              <button
                className="relative text-gray-700 transition hover:text-blue focus:outline-none"
                onClick={handleCartClick}
                aria-label="Carrito"
              >
                <CartIcon />
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-dark bg-blue text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </button>
              <button
                className="transition focus:outline-none"
                onClick={() => setNavigationOpen(!navigationOpen)}
                aria-label={navigationOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {navigationOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Ticker/marquee — debajo del área de navegación */}
        <div className="bg-blue py-1.5 overflow-hidden w-full">
          <div className="ticker-animate text-xs font-semibold text-dark">
            <span>{tickerContent}</span>
            <span>{tickerContent}</span>
            <span>{tickerContent}</span>
            <span>{tickerContent}</span>
          </div>
        </div>
      </header>

      <MobileMenu
        headerLogo={null}
        isOpen={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        menuData={menuData}
      />
    </>
  );
};

export default MainHeader;
