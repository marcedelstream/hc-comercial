"use client";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useCart } from "@/hooks/useCart";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { formatPrice } from "@/utils/formatePrice";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ActionBtn from "./ActionBtn";

const SingleItem = ({ item }: { item: any }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { addItem, cartDetails } = useCart();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const isAlradyAdded = Object.values(cartDetails ?? {}).some(
    (cartItem) => cartItem.id === item.id
  );

  const isAlradyWishListed = Object.values(wishlistItems ?? {}).some(
    (wishlistItem) => wishlistItem.id === item.id
  );

  const cartItem = {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ? item.discountedPrice : item.price,
    currency: "pyg",
    image: "",
    price_id: null,
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
    openModal();
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
      <div className="relative overflow-hidden rounded-xl bg-[#F6F7FB] min-h-[403px]">
        <div className="text-center px-4 py-7.5">
          <h3 className="font-semibold text-lg text-dark ease-out duration-200 hover:text-blue mb-1.5">
            <Link href={`/products/${item?.slug}`}>{item.title}</Link>
          </h3>

          <span className="flex items-center justify-center gap-2 text-base font-medium">
            <span className="text-dark">
              {formatPrice(item.discountedPrice || item.price)}
            </span>
            {item.discountedPrice && (
              <span className="line-through text-dark-4">
                {formatPrice(item.price)}
              </span>
            )}
          </span>
        </div>

        {/* Placeholder imagen */}
        <div className="flex items-center justify-center py-4">
          <Link href={`/products/${item?.slug}`}>
            <div className="bg-gray-2 rounded-xl flex flex-col items-center justify-center w-[200px] h-[200px]">
              <svg className="text-gray-4 mb-2" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-5 text-sm font-medium">Sin imagen</span>
            </div>
          </Link>
        </div>

        <div className="absolute right-0 bottom-0 w-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0 translate-x-full">
          <ActionBtn handleClick={handleQuickViewUpdate} text="Vista rápida" icon={"quick-view"} />
          {isAlradyAdded ? (
            <ActionBtn text="Finalizar compra" icon="check-out" />
          ) : (
            <ActionBtn
              handleClick={() => handleAddToCart()}
              text="Agregar al carrito"
              icon="cart"
              isDisabled={item.quantity < 1}
            />
          )}
          <ActionBtn
            handleClick={handleItemToWishList}
            text="Lista de deseos"
            icon="wishlist"
            addedToWishlist={isAlradyWishListed}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
