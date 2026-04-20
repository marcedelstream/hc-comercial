"use client";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { EyeIcon } from "@/assets/icons";
import { useCart } from "@/hooks/useCart";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";
import { calculateDiscountPercentage } from "@/utils/calculateDiscountPercentage";
import { formatPrice } from "@/utils/formatePrice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import CheckoutBtn from "../Shop/CheckoutBtn";
import WishlistButton from "../Wishlist/AddWishlistButton";
import Tooltip from "./Tooltip";

type Props = {
  bgClr?: string;
  item: any;
};

const ProductItem = ({ item, bgClr = "[#F6F7FB]" }: Props) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { addItem, cartDetails } = useCart();
  const pathUrl = usePathname();

  const isAlradyAdded = Object.values(cartDetails ?? {}).some(
    (cartItem) => cartItem.id === item.id
  );

  const cartItem = {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ? item.discountedPrice : item.price,
    currency: "pyg",
    image: "",
    slug: item?.slug,
    availableQuantity: item.quantity,
    color: "",
    size: "",
  };

  const handleQuickViewUpdate = () => {
    const serializableItem = {
      ...item,
      updatedAt:
        item.updatedAt instanceof Date
          ? item.updatedAt.toISOString()
          : item.updatedAt,
    };
    dispatch(updateQuickView(serializableItem));
  };

  const handleAddToCart = () => {
    if (item.quantity > 0) {
      // @ts-ignore
      addItem(cartItem);
      toast.success("¡Producto agregado al carrito!");
    } else {
      toast.error("Este producto no tiene stock.");
    }
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        slug: item.slug,
        image: "",
        price: item.discountedPrice ? item.discountedPrice : item.price,
        quantity: item.quantity,
        color: "",
      })
    );
  };

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden border border-gray-3 flex items-center justify-center rounded-xl bg-${bgClr} min-h-[270px] mb-4`}
      >
        {/* Placeholder imagen */}
        <Link
          href={`${
            pathUrl.includes("products")
              ? `${item?.slug}`
              : `products/${item?.slug}`
          }`}
        >
          <div className="flex flex-col items-center justify-center w-[200px] h-[200px]">
            <svg className="text-gray-4 mb-2" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-5 text-sm font-medium">Sin imagen</span>
          </div>
        </Link>

        <div className="absolute top-2 right-2">
          {item.quantity < 1 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
              Sin stock
            </span>
          ) : item?.discountedPrice && item?.discountedPrice > 0 ? (
            <span className="px-2 py-1 text-xs font-medium text-dark rounded-full bg-blue">
              {calculateDiscountPercentage(item.discountedPrice, item.price)}%
              OFF
            </span>
          ) : null}
        </div>

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <Tooltip content="Vista rápida" placement="top">
            <button
              className="border border-gray-3 h-[38px] w-[38px] rounded-lg flex items-center justify-center text-dark bg-white hover:text-dark hover:bg-blue"
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
            >
              <EyeIcon />
            </button>
          </Tooltip>

          {isAlradyAdded ? (
            <CheckoutBtn />
          ) : (
            <button
              onClick={() => handleAddToCart()}
              disabled={item.quantity < 1}
              className="inline-flex px-5 py-2 font-semibold h-[38px] text-dark duration-200 ease-out rounded-lg text-custom-sm bg-blue hover:bg-blue-dark"
            >
              {item.quantity > 0 ? "Agregar al carrito" : "Sin stock"}
            </button>
          )}

          <WishlistButton
            item={item}
            handleItemToWishList={handleItemToWishList}
          />
        </div>
      </div>

      <h3 className="font-semibold text-dark ease-out text-base duration-200 hover:text-blue mb-1.5 line-clamp-1">
        <Link
          href={`${
            pathUrl.includes("products")
              ? `${item?.slug}`
              : `products/${item?.slug}`
          }`}
        >
          {item.title}
        </Link>
      </h3>

      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-bold text-dark truncate">
          {formatPrice(item.discountedPrice || item.price)}
        </span>
        {item.discountedPrice && (
          <span className="text-xs line-through text-dark-4 truncate">
            {formatPrice(item.price)}
          </span>
        )}
      </span>
    </div>
  );
};

export default ProductItem;
