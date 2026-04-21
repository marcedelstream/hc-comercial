"use client";
import { useCart } from "@/hooks/useCart";
import { StaticProduct } from "@/data/staticData";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductActions({ product }: { product: StaticProduct }) {
  const { addItem, cartDetails } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const isAlreadyAdded = Object.values(cartDetails ?? {}).some((c) => c.id === product.id);

  const cartItem = {
    id: product.id,
    name: product.title,
    price: product.discountedPrice ?? product.price,
    currency: "pyg",
    image: "",
    slug: product.slug,
    availableQuantity: product.quantity,
    color: "",
    size: "",
    quantity: qty,
  };

  const handleAddToCart = () => {
    if (product.quantity < 1) {
      toast.error("Este producto no tiene stock.");
      return;
    }
    // @ts-ignore
    addItem(cartItem);
    toast.success("¡Producto agregado al carrito!");
  };

  const handleBuyNow = () => {
    if (product.quantity < 1) {
      toast.error("Este producto no tiene stock.");
      return;
    }
    // @ts-ignore
    addItem(cartItem);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Cantidad */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-dark">Cantidad:</span>
        <div className="flex items-center border border-gray-3 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-2 text-dark hover:bg-gray-2 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 text-dark font-medium min-w-[40px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(Math.min(product.quantity, qty + 1))}
            className="px-3 py-2 text-dark hover:bg-gray-2 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.quantity < 1}
          className="w-full py-3 px-4 font-semibold text-dark text-sm bg-blue hover:bg-blue-dark rounded-lg ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAlreadyAdded ? "Agregar más" : "Agregar al carrito"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={product.quantity < 1}
          className="w-full py-3 px-4 font-semibold text-white text-sm bg-dark hover:bg-dark-2 rounded-lg ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
