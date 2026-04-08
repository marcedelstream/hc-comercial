import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Envío a todo el país",
    description: "Cotizá el flete desde la página del producto",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Garantía incluida",
    description: "12 meses en todos los equipos",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "Pago seguro con Bancard",
    description: "Tu transacción protegida",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Atención personalizada",
    description: "WhatsApp: +595 982 800 258",
  },
];

const FooterFeature = () => {
  return (
    <section className="pb-[60px]">
      <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5">
          {featureData.map((item, key) => (
            <div className="flex items-center gap-4" key={key}>
              <Image src={item.img} alt="icono" width={40} height={41} />
              <div>
                <h3 className="text-lg font-semibold text-dark">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterFeature;
