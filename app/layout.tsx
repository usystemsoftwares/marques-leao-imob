import type { Metadata } from "next";
import { Baskervville, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Image from "next/image";
import Ellipse from "/public/marqueseleao/ellipse4.webp";
import { Track } from "./track";
import { Empresa } from "smart-imob-types";

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-baskervville",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const generateMetadata = async (): Promise<Metadata> => {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const data = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  const empresa: Empresa = await data.json();
  const icons = [];

  if (empresa.favicon) {
    icons.push({
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: empresa.favicon,
    });
    icons.push({
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: empresa.favicon,
    });
  }
  
  // Otimização SEO baseada nas sugestões do PDF
  const seoKeywords = [
    "Casas de alto padrão em Novo Hamburgo",
    "Imobiliária em Novo Hamburgo de luxo",
    "imóveis de luxo em Novo Hamburgo",
    "comprar casa em Novo Hamburgo",
    "Casas de luxo à venda",
    "Residências de alto padrão com piscina Novo Hamburgo",
    "Imóveis exclusivos em Novo Hamburgo",
    "Hamburgo Velho",
    "Lomba Grande",
    empresa.palavras_chave
  ].filter(Boolean).join(", ");

  return {
    title: "Casas de Alto Padrão em Novo Hamburgo | Sua Nova Residência Luxuosa!",
    description: "Na MARQUES&LEÃO você encontra casas de alto padrão em Novo Hamburgo. Imóveis de luxo em Hamburgo Velho, Lomba Grande e região. Confira!",
    keywords: seoKeywords,
    icons: {
      icon: icons,
    },
    openGraph: {
      title: "Casas de Alto Padrão em Novo Hamburgo | MARQUES&LEÃO",
      description: "Imóveis de luxo e alto padrão em Novo Hamburgo. Casas exclusivas com design moderno, acabamento premium e localização privilegiada.",
      type: "website",
      locale: "pt_BR",
      siteName: "MARQUES&LEÃO Imobiliária",
      images: empresa.logo ? [empresa.logo] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: "Casas de Alto Padrão em Novo Hamburgo | MARQUES&LEÃO",
      description: "Imóveis de luxo e alto padrão em Novo Hamburgo. Encontre sua residência dos sonhos.",
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.marqueseleao.com.br",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};

async function getData() {
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const uri =
    process.env.BACKEND_API_URI ??
    (process.env.NEXT_PUBLIC_BACKEND_API_URI as string);

  const data = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    empresa: await data.json(),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { empresa } = await getData();

  // Schema.org Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "MARQUES&LEÃO Imobiliária",
    "description": "Imobiliária especializada em imóveis de alto padrão e luxo em Novo Hamburgo",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.marqueseleao.com.br",
    "logo": empresa.logo,
    "telephone": empresa.telefone || empresa.whatsapp,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": empresa.endereço || "",
      "addressLocality": "Novo Hamburgo",
      "addressRegion": "RS",
      "addressCountry": "BR"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Novo Hamburgo"
      },
      {
        "@type": "Place",
        "name": "Hamburgo Velho"
      },
      {
        "@type": "Place",
        "name": "Lomba Grande"
      }
    ],
    "priceRange": "$$$",
    "openingHours": empresa.horario_funcionamento || "Mo-Fr 09:00-18:00, Sa 09:00-13:00"
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Snippet do Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TQ4BBVQ');`,
          }}
        ></script>
        {/* Fim do Snippet do Google Tag Manager */}

        {/* Outros elementos já existentes no head */}
        <link rel="stylesheet" href={empresa.font_body} />
        <link rel="stylesheet" href={empresa.font_title} />
        <link rel="icon" href={empresa.favicon ?? ""} sizes="any" />
        <meta name="referrer" content="origin" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
      </head>
      <body
        className={`${montserrat.variable} ${baskervville.variable} font-montserrat antialiased overflow-x-hidden`}
      >
        {/* Snippet do Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQ4BBVQ"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        ></noscript>
        {/* Fim do Snippet do Google Tag Manager (noscript) */}

        {/* Conteúdo dinâmico */}
        {empresa.google_code && (
          <div dangerouslySetInnerHTML={{ __html: empresa.google_code }}></div>
        )}
        {empresa.scripts_extras && (
          <div
            dangerouslySetInnerHTML={{ __html: empresa.scripts_extras }}
          ></div>
        )}
        <div className="absolute right-0 top-0 w-1/2 lg:w-[40%] aspect-square overflow-hidden">
          <Image
            draggable={false}
            className="absolute top-[-20%] lg:top-[-35%] opacity-50 right-[-35%] lg:right-[-30%] w-full"
            src={Ellipse}
            alt="Ellipse blur"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
        {/* Início do contêiner flexível */}
        <div className="min-h-screen flex flex-col w-full">
          {/* Conteúdo principal */}
          <main className="flex-grow">{children}</main>
          {/* Rodapé */}
          <Footer empresa={empresa} />
        </div>
        <Track empresaId={empresa.db_id} />
      </body>
    </html>
  );
}
