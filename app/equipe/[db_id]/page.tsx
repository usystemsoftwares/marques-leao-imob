import Header from "@/components/header";
import { equipe, imoveis } from "@/data";
import Image from "next/image";
import Link from "next/link";
import Whatsapp from "/public/marqueseleao/white-wpp-icon.svg";
import Instagram from "/public/marqueseleao/instagram-icon.svg";
import Carousel from "@/components/carousel";
import processarFiltros from "@/utils/processar-filtros-backend";
import { Corretor, Imóvel } from "smart-imob-types";
import { formatarTelefoneParaWhatsApp } from "@/utils/formatarTelefoneParaWhatsApp";
import getWhatsappLink from "@/utils/generate_phone_href";

async function getData(id: string): Promise<{
  corretor: Corretor;
  imoveis: {
    total: number;
    nodes: Imóvel[];
  };
}> {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const dataCorretor = await fetch(`${uri}/corretores/${id}`, {
    next: { tags: [`corretores-${id}`] },
  });

  if (!dataCorretor.ok) {
    throw new Error("Failed to fetch data");
  }

  const corretor = await dataCorretor.json();

  const PAGE_SIZE = "10";

  const params = new URLSearchParams({
    empresa_id,
    filtros: JSON.stringify(
      processarFiltros({ agenciador_id: corretor.db_id })
    ),
    limit: PAGE_SIZE,
  });
  const imoveis = await fetch(
    `${uri}/imoveis/site/paginado?${params.toString()}`,
    {
      next: { tags: ["imoveis-paginado"], revalidate: 3600 },
    }
  );

  return {
    corretor,
    imoveis: await imoveis.json(),
  };
}

const Membro = async ({ params: { db_id } }: { params: { db_id: string } }) => {
  const { corretor, imoveis } = await getData(db_id);

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-28 mb-20">
        <section className="w-[min(90%,75rem)] mx-auto flex flex-col md:flex-row items-center md:justify-center gap-14">
          <div>
            <Image
              className="rounded-[.625rem]"
              src={corretor.foto || ""}
              alt={corretor.nome}
              width={411}
              height={524}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="md:w-1/2">
            <div className="flex items-end justify-between">
              <h1 className={`text-5xl font-bold uppercase font-baskervville`}>
                {corretor.nome}
              </h1>
              {corretor.CRECI && (
                <span className="hidden lg:inline text-[#707070]">
                  CRECI: {corretor.CRECI}
                </span>
              )}
            </div>
            <p className="mt-3 mb-4 text-[#d6d6d6]">{corretor.bio}</p>
            <p className="text-[#d6d6d6]">{corretor.cargo}</p>
            <div className="flex mt-7 items-center gap-6">
              {corretor.qtdImoveis > 0 && (
                <p>
                  <span className="text-3xl block font-bold">
                    +{corretor.qtdImoveis}
                  </span>{" "}
                  imóveis <br /> em carteira
                </p>
              )}
              {Number(corretor.anos_de_experiencia || 0) > 0 && (
                <p>
                  <span className="text-3xl block font-bold">
                    +{corretor.anos_de_experiencia}
                  </span>{" "}
                  anos de <br /> experiência
                </p>
              )}
            </div>
            <div className="lg:mr-28 mt-4 flex flex-col lg:flex-row flex-wrap lg:flex-nowrap gap-4 lg:gap-8 *:flex *:gap-2 *:items-center *:justify-center *:text-[1.0625rem] *:border-2 *:py-2 *:px-11 lg:px-0 *:w-fit lg:*:w-full *:rounded-lg">
              {(corretor.telefone || corretor.whatsapp) && (
                <Link
                  className="bg-[#108D10] border-transparent"
                  href={getWhatsappLink(corretor)}
                  target="_blank"
                >
                  <Image
                    src={Whatsapp}
                    alt="Whatsapp"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />{" "}
                  WhatsApp
                </Link>
              )}

              {corretor.instagram && (
                <Link
                  className="border-white"
                  href={`https://www.instagram.com/${corretor.instagram}`}
                  target="_blank"
                >
                  <Image
                    src={Instagram}
                    alt="Instagram"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  Instagram
                </Link>
              )}
            </div>
          </div>
        </section>
        <section className="w-full md:w-[min(90%,80rem)] mx-auto mt-20 relative">
          <div className="w-[min(90%,75rem)] mx-auto">
            <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">
              Do corretor
            </span>
            <h2 className={`text-3xl font-baskervville`}>
              Imóveis do Corretor
            </h2>
          </div>
          <div>
            <Carousel estates={imoveis.nodes} logo={corretor?.empresa?.logo || ''} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Membro;
