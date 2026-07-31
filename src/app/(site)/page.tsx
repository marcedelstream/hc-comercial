import { Metadata } from 'next'
import Home from "@/components/Home";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hccomercial.com.py'

export const metadata: Metadata = {
  title: 'HC COMERCIAL — Equipos Gastronómicos en Paraguay',
  description: 'Venta de equipos gastronómicos en Paraguay. Hornos industriales, freidoras, heladeras comerciales, batidoras y más. Envío a todo el país. Consultá por WhatsApp.',
  keywords: 'equipos gastronómicos Paraguay, hornos industriales Asunción, freidoras comerciales, heladeras industriales, cocinas industriales Paraguay, HC COMERCIAL',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'HC COMERCIAL — Equipos Gastronómicos en Paraguay',
    description: 'Venta de equipos gastronómicos en Paraguay. Hornos, freidoras, heladeras y más. Envío a todo el país.',
    url: SITE_URL,
    siteName: 'HC COMERCIAL',
    locale: 'es_PY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HC COMERCIAL — Equipos Gastronómicos en Paraguay',
    description: 'Venta de equipos gastronómicos en Paraguay. Hornos, freidoras, heladeras y más.',
  },
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HC COMERCIAL S.R.L.',
  url: SITE_URL,
  logo: `${SITE_URL}/hc-comercial-logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+595-982-800-258',
    contactType: 'sales',
    availableLanguage: 'Spanish',
  },
  sameAs: [`https://wa.me/595982800258`],
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HC COMERCIAL',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default async function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
      <Home />
    </>
  )
}
