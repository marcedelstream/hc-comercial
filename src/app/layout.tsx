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
  const seoSettings = await getSeoSettings()
  const site_name = await getSiteName()
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hccomercial.com.py'

  const title = seoSettings?.siteTitle
    ? `${seoSettings.siteTitle} | ${site_name}`
    : 'HC COMERCIAL — Equipos Gastronómicos Paraguay'

  const description = seoSettings?.metadescription ||
    'Venta de equipos gastronómicos en Paraguay. Hornos, freidoras, heladeras comerciales y más. Envío a todo el país.'

  const keywords = seoSettings?.metaKeywords ||
    'equipos gastronómicos Paraguay, hornos industriales, freidoras, cocinas industriales, HC COMERCIAL'

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: site_name || 'HC COMERCIAL',
      locale: 'es_PY',
      type: 'website',
      images: seoSettings?.metaImage
        ? [{ url: seoSettings.metaImage, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seoSettings?.metaImage ? [seoSettings.metaImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/hc-comercial-logo.png',
      shortcut: '/hc-comercial-logo.png',
      apple: '/hc-comercial-logo.png',
    },
  }
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
