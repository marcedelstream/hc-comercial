import { CallIcon, EmailIcon, MapIcon } from "@/assets/icons";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/assets/icons/social";
import Image from "next/image";
import Link from "next/link";
import FooterBottom from "./FooterBottom";
import QuickLinks from "./QuickLinks";

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-gray-3">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* Footer menú */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-20">
          <div className="max-w-[330px] w-full">
            <div className="mb-5">
              <Image
                src="/hc-comercial-logo.png"
                alt="HC COMERCIAL"
                width={130}
                height={85}
                className="object-contain"
              />
            </div>
            <p className="text-base text-dark-3 mb-6">
              Equipos gastronómicos de alta calidad para tu negocio. Envíos a todo el Paraguay.
            </p>

            <ul className="flex flex-col gap-3">
              <li className="flex gap-4.5 text-base">
                <span className="shrink-0">
                  <MapIcon className="fill-blue" width={24} height={24} />
                </span>
                Asunción, Paraguay
              </li>

              <li>
                <Link
                  href="https://wa.me/595982800258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4.5 text-base hover:text-blue"
                >
                  <CallIcon className="fill-blue" width={24} height={24} />
                  +595 982 800 258
                </Link>
              </li>

              <li>
                <Link
                  href="mailto:ventas@hccomercial.com.py"
                  className="flex items-center gap-4.5 text-base hover:text-blue"
                >
                  <EmailIcon className="fill-blue" width={24} height={24} />
                  ventas@hccomercial.com.py
                </Link>
              </li>
            </ul>

            {/* Redes Sociales */}
            <div className="flex items-center gap-4 mt-7.5">
              <Link
                href="https://www.facebook.com/HCComercialterminalSrl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.instagram.com/hccomercialpy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Instagram</span>
                <InstagramIcon />
              </Link>
            </div>
          </div>

          <QuickLinks />

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-xl font-semibold text-dark lg:text-right">
              Contacto Rápido
            </h2>
            <p className="mb-4 lg:text-right text-custom-sm">
              Consultá por precios, disponibilidad y envíos.
            </p>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="https://wa.me/595982800258"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-3 px-6 bg-blue text-dark font-semibold rounded-lg hover:bg-blue-dark ease-out duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribinos por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
