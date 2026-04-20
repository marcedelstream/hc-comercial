import "./css/style.css";
import { Metadata } from "next";
import { getSeoSettings, getSiteName } from "@/get-api-data/seo-setting";
import { GoogleTagManager } from '@next/third-parties/google';
import { DM_Sans } from 'next/font/google'

const dm_sans = DM_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-body",
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await getSeoSettings();
  const site_name = await getSiteName();
  return {
    title: `${seoSettings?.siteTitle || "Home Page"} | ${site_name}`,
    description: seoSettings?.metadescription || "Cozy-commerce is a next.js e-commerce boilerplate built with nextjs, typescript, tailwindcss, and prisma.",
    keywords: seoSettings?.metaKeywords || "e-commerce, online store",
    openGraph: {
      images: seoSettings?.metaImage ? [seoSettings.metaImage] : [],
    },
    icons: {
      icon: "/hc-comercial-logo.png",
      shortcut: "/hc-comercial-logo.png",
      apple: "/hc-comercial-logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seoSettings = await getSeoSettings();
  return (
    <html lang="es">
      <body suppressHydrationWarning={true} className={dm_sans.variable}>
        {children}
        {seoSettings?.gtmId && <GoogleTagManager gtmId={seoSettings.gtmId} />}
      </body>
    </html>
  );
}
