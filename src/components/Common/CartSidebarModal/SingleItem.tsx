import { TrashIcon } from "@/assets/icons";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatePrice";

const SingleItem = ({ item }: any) => {
  const { removeItem, handleCartClick } = useCart();
  const router = useRouter();
  const handleRemoveFromCart = () => {
    removeItem(item.id);
  };

  const handleProductClick = () => {
    router.push(`/products/${item.slug}`);
    setTimeout(() => {
      handleCartClick();
    }, 500);
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center w-full gap-6">
        <div className="flex flex-col items-center justify-center rounded-[10px] bg-gray-3 w-22.5 h-22.5 shrink-0">
          <svg className="text-gray-5" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <h3 className="mb-1 text-base font-medium duration-200 ease-out text-dark hover:text-blue">
            <button onClick={handleProductClick} className="text-start">
              {item.name} ({item.quantity})
            </button>
          </h3>
          <p className="font-normal text-custom-sm text-dark-4">
            Precio: {formatPrice(item.price)}
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={handleRemoveFromCart}
          aria-label="Eliminar producto del carrito"
          className="flex items-center justify-center rounded-lg w-[38px] h-[38px] bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
