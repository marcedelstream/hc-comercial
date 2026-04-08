"use client";
import { useCart } from "@/hooks/useCart";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { StaticProduct } from "@/data/staticData";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductActions({ product }: { product: StaticProduct }) {
  const { addItem, cartDetails } = useCart();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isAlreadyAdded = Object.values(cartDetails ?? {}).some((c) => c.id === product.id);
  const isWishlisted = Object.values(wishlistItems ?? {}).some((w) => w.id === product.id);

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

  const handleWishlist = () => {
    dispatch(
      addItemToWishlist({
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: "",
        price: product.discountedPrice ?? product.price,
        quantity: product.quantity,
        color: "",
      })
    );
    toast.success(isWishlisted ? "Quitado de la lista de deseos" : "¡Agregado a la lista de deseos!");
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
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.quantity < 1}
          className="flex-1 py-3 px-6 font-semibold text-dark bg-blue hover:bg-blue-dark rounded-lg ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAlreadyAdded ? "Agregar más" : "Agregar al carrito"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={product.quantity < 1}
          className="flex-1 py-3 px-6 font-semibold text-white bg-dark hover:bg-dark-2 rounded-lg ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comprar ahora
        </button>
      </div>

      {/* Lista de deseos */}
      <button
        onClick={handleWishlist}
        className="flex items-center gap-2 text-sm text-dark-3 hover:text-blue transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={isWishlisted ? "text-red" : ""}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {isWishlisted ? "Quitado de la lista de deseos" : "Agregar a la lista de deseos"}
      </button>
    </div>
  );
}
