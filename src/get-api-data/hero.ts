import { staticHeroBanners, staticHeroSliders } from "@/data/staticData";

// get hero banners
export const getHeroBanners = async () => {
  return staticHeroBanners;
};

// get hero sliders
export const getHeroSliders = async () => {
  return staticHeroSliders;
};

// single hero banner
export const getSingleHeroBanner = async (id: number) => {
  return staticHeroBanners.find((b) => b.id === id) ?? null;
};
