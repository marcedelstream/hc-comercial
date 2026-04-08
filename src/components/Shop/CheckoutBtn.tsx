import Link from "next/link";
import React from "react";

const CheckoutBtn = () => {
  return (
    <Link
      href="/checkout"
      className="bg-blue hover:bg-blue-dark inline-flex font-semibold text-custom-sm py-[7px] px-5 rounded-lg text-dark ease-out duration-200"
    >
      Finalizar compra
    </Link>
  );
};

export default CheckoutBtn;
