import Link from "next/link";

const SingleItem = ({ item }: { item: any }) => {
  return (
    <Link
      href={`/shop?category=${item.slug || item.id}`}
      className="flex flex-col items-center group"
    >
      <div className="w-[130px] h-[130px] bg-[#F2F3F8] rounded-full flex items-center justify-center mb-4 group-hover:bg-blue transition-colors duration-300">
        <svg className="text-gray-5 group-hover:text-dark transition-colors" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block text-base font-medium text-center duration-500 text-dark group-hover:text-blue">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
