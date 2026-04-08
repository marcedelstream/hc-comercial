import { staticCategories } from "@/data/staticData";

export const getCategories = async () => {
  return staticCategories;
};

export const getCategoryBySlug = async (slug: string) => {
  return staticCategories.find((c) => c.slug === slug) ?? null;
};

export const getCategoryById = async (id: number) => {
  return staticCategories.find((c) => c.id === id) ?? null;
};
