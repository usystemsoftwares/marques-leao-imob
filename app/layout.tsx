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
  return {
    title: "Imobiliária Marques & Leão",
    description: empresa.descrição,
    keywords: empresa.palavras_chave,
    icons: {
      icon: icons,
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

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={empresa.font_body} />
        <link rel="stylesheet" href={empresa.font_title} />
        <link rel="icon" href={empresa.favicon ?? ""} sizes="any" />
        <meta name="referrer" content="origin" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </head>
      <body
        className={`${montserrat.variable} ${baskervville.variable} font-montserrat antialiased overflow-x-hidden`}
      >
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
