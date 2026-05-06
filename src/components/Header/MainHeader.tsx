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

const TICKER_MSGS = [
  "🚚 Envíos a todo el Paraguay",
  "🎁 Envíos gratis desde Gs. 1.000.000",
  "📞 WhatsApp: +595982800258",
];

const MainHeader = ({ headerData }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { handleCartClick, cartCount } = useCart();
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

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

  const msgs = headerData?.headerText ? [headerData.headerText] : TICKER_MSGS;

  useEffect(() => {
    if (msgs.length <= 1) return;
    const timer = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIdx((i) => (i + 1) % msgs.length);
        setTickerVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, [msgs.length]);

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
                width={170}
                height={110}
                className="h-16 w-auto object-contain"
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
            <div className="flex xl:hidden items-center gap-2 pr-1">
              <button
                className="relative text-gray-700 transition hover:text-blue focus:outline-none p-1.5"
                onClick={handleCartClick}
                aria-label="Carrito"
              >
                <CartIcon />
                <span className="absolute top-0 right-0 w-[18px] h-[18px] text-dark bg-blue text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </button>
              <button
                className="transition focus:outline-none p-1.5"
                onClick={() => setNavigationOpen(!navigationOpen)}
                aria-label={navigationOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {navigationOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Ticker — barra de mensajes rotativos */}
        <div className="bg-blue py-1.5 w-full">
          <p
            className={`text-xs font-semibold text-dark text-center transition-opacity duration-300 ${
              tickerVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {msgs[tickerIdx]}
          </p>
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
