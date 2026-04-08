import { staticProducts } from "@/data/staticData";

// get product for id and title
export const getProductsIdAndTitle = async () => {
  return staticProducts.map((p) => ({ id: p.id, title: p.title }));
};

// get new arrival product
export const getNewArrivalsProduct = async () => {
  return staticProducts.slice(0, 8);
};

// get best selling product
export const getBestSellingProducts = async () => {
  return [...staticProducts]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6);
};

// get latest product
export const getLatestProducts = async () => {
  return staticProducts.slice(0, 3);
};

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  return staticProducts;
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (slug: string) => {
  const product = staticProducts.find((p) => p.slug === slug);
  return product ?? null;
};

// GET PRODUCT BY ID
export const getProductById = async (productId: string) => {
  return staticProducts.find((p) => p.id === productId) ?? null;
};

// GET RELATED PRODUCTS
export const getRelatedProducts = async (
  category: string,
  tags: string[] | undefined,
  currentProductId: string,
  productTitle: string
) => {
  return staticProducts
    .filter((p) => p.id !== currentProductId)
    .filter(
      (p) =>
        p.category.title.toLowerCase().includes(category.toLowerCase()) ||
        (tags && p.tags.some((t) => tags.includes(t)))
    )
    .slice(0, 8);
};
