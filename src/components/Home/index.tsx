import BestSeller from "./BestSeller";
import Categories from "./Categories";
import CountDown from "./Countdown";
import Hero from "./Hero";
import FooterFeature from "./Hero/FooterFeature";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Testimonials from "./Testimonials";
import { supabase } from "@/lib/supabase-admin";
import { getPromoBannersFromDB } from "@/lib/storefront-data";
import type { Testimonial } from "@/types/testimonial";
import type { StaticHeroBanner } from "@/data/staticData";

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

const Home = async () => {
  let testimonials: Testimonial[] = [];
  let promoBanners: StaticHeroBanner[] = [];

  try {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      testimonials = data.map((t) => ({
        review: t.comment ?? "",
        authorName: t.customer_name ?? "",
        authorRole: "",
        authorImg: t.avatar_url ?? "/images/users/user-01.jpg",
      }));
    }
  } catch {
    // silently fall back to static data
  }

  if (useDB) {
    try {
      promoBanners = await getPromoBannersFromDB()
    } catch {
      // silently fall back to hardcoded
    }
  }

  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner initialData={promoBanners} />
      <BestSeller />
      <CountDown />
      {(!useDB || testimonials.length > 0) && <Testimonials initialData={testimonials} />}
      <FooterFeature />
    </main>
  );
};

export default Home;
