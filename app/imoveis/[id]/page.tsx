import Header from "@/components/header";
import Image from "next/image";
import Carousel from "@/components/carousel";
import Link from "next/link";

import Ellipse from "/public/marqueseleao/ellipse4.webp";

import LocationIcon from "/public/marqueseleao/location-icon.svg";

import EstateBedIcon from "/public/marqueseleao/estate-bed-icon.svg";
import BathIcon from "/public/marqueseleao/bath-icon.svg";
import CarIcon from "/public/marqueseleao/car-icon.svg";
import DimensionIcon from "/public/marqueseleao/dimension-icon.svg";

import CheckIcon from "/public/marqueseleao/check-icon.svg";

import Whatsapp from "/public/marqueseleao/white-wpp-icon.svg";
import Instagram from "/public/marqueseleao/instagram-icon.svg";
import PropertiesFilter from "../components/properties-filter";
import { notFound } from "next/navigation";
import {
  Corretor,
  Empreendimento,
  Empresa,
  ImoveisInfoType,
  Imóvel,
} from "smart-imob-types";
import getWhatsappLink from "@/utils/generate_phone_href";
import { toBRL } from "@/utils/toBrl";
import PropertyPhotos from "../components/property-photos";
import processarFiltros from "@/utils/processar-filtros-backend";
import checkFetchStatus from "@/utils/checkFetchStatus";
import { Metadata, ResolvingMetadata } from "next";

// export async function generateMetadata(
//   { params }: { params: { houseId: string } },
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const uri =
//     process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
//   const empresa_id: any =
//     process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

//   const dataImovel = await fetch(`${uri}/imoveis/site/${params.houseId}`);
//   const dataEmpresa = await fetch(`${uri}/empresas/site/${empresa_id}`, {
//     next: { tags: ["empresas"] },
//   });

//   if (!dataEmpresa.ok || !dataImovel.ok) {
//     notFound();
//   }
//   const imovel: Imóvel = await dataImovel.json();
//   const empresa: Empresa = await dataEmpresa.json();
//   const firstImage =
//     imovel.fotos.find((image) => image.destaque) || imovel.fotos[0];
//   return {
//     title: imovel.titulo ?? empresa.titulo_site ?? "",
//     description: imovel.descrição ?? empresa.descrição ?? "",
//     openGraph: {
//       title: imovel.titulo ?? empresa.titulo_site ?? "",
//       description: imovel.descrição ?? empresa.descrição ?? "",
//       type: "website",
//       images:
//         firstImage.resized_webp ??
//         firstImage.resized_md ??
//         firstImage.resized ??
//         "",
//     },
//   };
// }

async function getData(
  houseId: string,
  afiliado: any
): Promise<{
  empresa: Empresa;
  imovel: Imóvel | null;
  corretor: Corretor | null;
  temporada: any;
  empreendimento: Empreendimento;
  imoveisRelacionados: {
    nodes: Imóvel[];
    total: number;
  };
  estados: {
    nodes: any[];
    total: number;
  };
  cidades: any[];
  tipos: any[];
  codigos: any[];
  info: ImoveisInfoType;
}> {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

  const dataImovel = await fetch(`${uri}/imoveis/site/${houseId}`, {
    next: { tags: [`imovel-${houseId}`] },
  });
  const empresa = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"] },
  });

  if (!empresa.ok || !dataImovel.ok) {
    notFound();
  }

  const parseJSON = async (response: Response) => {
    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };

  const imovel = await parseJSON(dataImovel);
  const corretor = imovel?.agenciador_id
    ? await fetch(`${uri}/corretores/${afiliado || imovel.agenciador_id}`, {
        next: { tags: [`corretores-${afiliado || imovel.agenciador_id}`] },
      }).then(parseJSON)
    : null;

  const temporada = imovel?.temporada
    ? await fetch(`${uri}/reservas/imovel/${imovel.db_id}`, {
        next: { tags: [`reservas-${imovel.db_id}`] },
      }).then(parseJSON)
    : null;

  const empreendimento = imovel?.empreendimento_id
    ? await fetch(`${uri}/empreendimentos/${imovel.empreendimento_id}`, {
        next: { tags: [`empreendimento-${imovel.empreendimento_id}`] },
      }).then(parseJSON)
    : null;

  const params_imoveis = new URLSearchParams({
    limit: "24",
    startAt: "0",
    filtros: JSON.stringify(
      processarFiltros({
        relacionados: houseId,
        venda: imovel.venda,
        locação: imovel.locação,
        temporada: imovel.temporada,
        preco_max: imovel.venda ? imovel.preço_venda + 500000 : undefined,
        preco_min: imovel.venda ? imovel.preço_venda - 500000 : undefined,
        preco_min_locacao: imovel.locação
          ? Number(imovel.preço_locação) + 750
          : undefined,
        preco_max_locacao: imovel.locação
          ? Number(imovel.preço_locação) - 750
          : undefined,
        tipos: [imovel.tipo],
        cidade_id: imovel.cidade && imovel.cidade.id,
      })
    ),
    order: JSON.stringify([]),
    empresa_id,
  });

  const imoveisResponse = await fetch(
    `${uri}/imoveis/site/paginado?${params_imoveis.toString()}`,
    {
      next: { tags: ["imoveis-paginado"] },
    }
  );

  const params = new URLSearchParams({
    empresa_id,
  });

  const responseEstados = await fetch(`${uri}/estados`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const info = await fetch(`${uri}/imoveis/info?${params.toString()}`, {
    next: { tags: ["imoveis-info"], revalidate: 3600 },
  });

  const cidades = await fetch(
    `${uri}/imoveis/cidades/contagem?${params.toString()}`,
    {
      next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
    }
  );


  if (!responseEstados.ok || !info.ok || !cidades.ok) {
    throw new Error("Failed to fetch data");
  }


  const responseTipos = await fetch(
    `${uri}/imoveis/tipos?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!responseTipos.ok) {
    throw new Error(`Erro na requisição: ${responseTipos.status}`);
  }

  const responseCodigos = await fetch(
    `${uri}/imoveis/codigos?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!responseCodigos.ok) {
    throw new Error(`Erro na requisição: ${responseCodigos.status}`);
  }

  return {
    empresa: await parseJSON(empresa),
    imovel,
    corretor,
    temporada,
    empreendimento,
    imoveisRelacionados: await parseJSON(imoveisResponse),
    info: await info.json(),
    estados: await responseEstados.json(),
    cidades: await cidades.json(),
    tipos: await responseTipos.json(),
    codigos: await responseCodigos.json(),
  };
}

const RealEstatePage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: any };
}) => {
  const { id } = params;
  const afiliado = searchParams.afiliado || "";
  const VerFotos = searchParams.VerFotos === "true";
  const uid = searchParams.uid || "";

  const {
    imovel,
    corretor,
    temporada,
    empreendimento,
    empresa,
    imoveisRelacionados,
    estados,
    cidades,
    info,
    tipos,
    codigos,
  } = await getData(id, afiliado);

  if (!imovel) return <></>;

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <PropertiesFilter
        cidades={Object.keys(cidades ?? {})}
        bairros={info.bairros_disponiveis}
        codigos={codigos}
        searchParams={searchParams}
        className="hidden lg:flex w-[min(100%,31.875rem)] absolute mt-14 top-0 right-1/2 translate-x-[75%]"
      />
      <main className="mt-8">
        <section>
          <PropertyPhotos
            empresa={empresa}
            imovel={imovel}
            afiliado={afiliado}
            liberado={!!uid || false}
            VerFotos={VerFotos}
          />
        </section>
        <section className="relative lg:pl-10 w-[min(90%,84.5rem)] mx-auto lg:ml-auto mt-16 lg:mr-28 lg:flex lg:justify-between lg:gap-28">
          <Image
            draggable={false}
            className="hidden lg:block absolute opacity-70 right-[-40%] -z-10 w-[75%]"
            src={Ellipse}
            alt="Ellipse blur"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <Image
            draggable={false}
            className="hidden lg:block absolute opacity-60 bottom-[-10%] left-[-45%] -z-10 w-[75%]"
            src={Ellipse}
            alt="Ellipse blur"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <div className="lg:w-[55%]">
            <div className="mb-8">
              <span className="text-[#707070]">
                Casa à venda · {imovel.estado?.nome} · {imovel.cidade?.nome} ·
                Cód {imovel.codigo}
              </span>
              <h1 className="text-4xl mt-6 font-bold">{imovel.titulo}</h1>
              <div className="mt-4 flex items-center gap-3">
                {(imovel.caracteristicas || []).some(
                  (carac) => carac.nome === "Exclusividade"
                ) && (
                  <span className="inline-block bg-[#530944] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">
                    Exclusividade
                  </span>
                )}
                {imovel.preço_venda_desconto &&
                  Number(imovel.preço_venda_desconto) > 0 && (
                    <span className="bg-[#095310] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg whitespace-nowrap">
                      Imóvel com desconto
                    </span>
                  )}
                <p className="text-[#707070]">
                  ${(imovel.tipo || '').toLowerCase()} para comprar em
                  <br />
                </p>
              </div>
              <p className="mt-3 flex gap-3 underline">
                <Image
                  src={LocationIcon}
                  alt="Ícone de localização"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />{" "}
                {imovel.bairro}, {imovel.cidade?.nome}
              </p>
              <p className="text-5xl lg:text-[clamp(2.75rem,4.8vw,3.75rem)] font-semibold mt-5">
                {(() => {
                  if (
                    imovel["preço_venda_desconto"] &&
                    Number(imovel["preço_venda_desconto"]) > 0 &&
                    (imovel["venda_exibir_valor_no_site"] === undefined ||
                      imovel["venda_exibir_valor_no_site"] === true)
                  ) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-gray-500 line-through text-2xl">
                          {toBRL(imovel.preço_venda)}
                        </span>
                        <span className="text-5xl font-semibold">
                          {toBRL(Number(imovel.preço_venda_desconto))}
                        </span>
                      </div>
                    );
                  } else if (
                    imovel["preço_venda"] &&
                    Number(imovel["preço_venda"]) > 0 &&
                    (imovel["venda_exibir_valor_no_site"] === undefined ||
                      imovel["venda_exibir_valor_no_site"] === true)
                  ) {
                    return <span>{toBRL(imovel["preço_venda"])}</span>;
                  } else if (
                    imovel.venda &&
                    imovel["preço_venda"] &&
                    imovel["venda_exibir_valor_no_site"] === false
                  ) {
                    return <span>Consulte-nos</span>;
                  }
                  return null;
                })()}

                {(() => {
                  if (
                    imovel["preço_locação_desconto"] &&
                    Number(imovel["preço_locação_desconto"]) > 0 &&
                    (imovel["locação_exibir_valor_no_site"] === undefined ||
                      imovel["locação_exibir_valor_no_site"] === true)
                  ) {
                    return (
                      <div className="flex flex-col mt-4">
                        <span className="text-gray-500 line-through text-2xl">
                          {toBRL(imovel.preço_locação)} / locação
                        </span>
                        <span className="text-5xl font-semibold">
                          {toBRL(Number(imovel.preço_locação_desconto))} /
                          locação
                        </span>
                      </div>
                    );
                  } else if (
                    imovel.preço_locação &&
                    Number(imovel.preço_locação) > 0 &&
                    (imovel.locação_exibir_valor_no_site === undefined ||
                      imovel.locação_exibir_valor_no_site === true)
                  ) {
                    return (
                      <span className="mt-4">
                        {toBRL(imovel.preço_locação)} / locação
                      </span>
                    );
                  } else if (
                    imovel.locação &&
                    imovel.preço_locação &&
                    imovel.locação_exibir_valor_no_site === false
                  ) {
                    return <span className="mt-4">Consulte-nos / locação</span>;
                  }
                  return null;
                })()}

                {/* Preço de Temporada */}
                {imovel.temporada && imovel["padrao_diaria"] && (
                  <span className="mt-4">
                    Diária: {toBRL(imovel.padrao_diaria)}
                  </span>
                )}
              </p>
              <p className="mt-4 text-[#707070]">
                {!!(
                  Number(imovel.preço_condominio) &&
                  imovel.preço_condominio !== 0
                )
                  ? `Condomínio: ${toBRL(Number(imovel.preço_condominio))} `
                  : null}
                {!!(Number(imovel.IPTU) && imovel.IPTU !== 0)
                  ? `  IPTU Anual: ${toBRL(Number(imovel.IPTU))}`
                  : null}
              </p>
              <ul className="mt-12 flex text-[#E9E9E9] font-light items-center text-center text-sm gap-6 flex-wrap">
                {imovel.area_terreno ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={DimensionIcon}
                      alt="Dimensão"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />{" "}
                    Área do Terreno <br />
                    {imovel.area_terreno} m
                  </li>
                ) : (
                  <></>
                )}
                {imovel.area_privativa ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={DimensionIcon}
                      alt="Dimensão"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />{" "}
                    Área privativa <br />
                    {imovel.area_privativa} m
                  </li>
                ) : (
                  <></>
                )}
                {imovel.dormitórios && !imovel.não_mostrar_dormítorios ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={EstateBedIcon}
                      alt="Cama"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />{" "}
                    {imovel.dormitórios} dormitórios <br />{" "}
                    {imovel.suítes ? `${imovel.suítes} suíte` : ""}
                  </li>
                ) : (
                  <></>
                )}
                {imovel.vagas ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={CarIcon}
                      alt="Carro"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                    {imovel.vagas} vagas <br /> de garagem
                  </li>
                ) : (
                  <></>
                )}
                {imovel.banheiros ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={BathIcon}
                      alt="Banheiro"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />{" "}
                    {imovel.banheiros} banheiros
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            </div>
            <div className="pt-8 border-t border-[#707070]">
              <h2 className="text-3xl mb-6 font-semibold">
                Descrição do imóvel
              </h2>
              <p className="text-[#E9E9E9] text-lg font-light">
                {imovel["descrição"] && (
                  <div
                    dangerouslySetInnerHTML={{ __html: imovel["descrição"] }}
                  ></div>
                )}
              </p>
            </div>
            {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
              <div className="mt-8">
                <h3 className={`text-3xl font-baskervville tracking-wide`}>
                  Informações adicionais
                </h3>
                <ul className="mt-3 grid font-light text-[#E9E9E9] gap-2 lg:grid-cols-2">
                  {(imovel.caracteristicas || []).map((info) => (
                    <li className="flex items-end gap-3" key={info.id}>
                      <Image
                        src={CheckIcon}
                        alt="Verificado"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                      {info.nome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {corretor && corretor.aparecer_site && (
            <div className="mt-12 lg:mt-0 lg:w-[45%]">
              <Link
                className="inline-block max-w-[23.125rem]"
                href={`/equipe/${corretor?.db_id}`}
              >
                <Image
                  className="rounded-[.625rem]"
                  src={corretor?.foto ?? ""}
                  alt={corretor?.nome}
                  width={370}
                  height={452}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Link>
              <h2
                className={`text-5xl lg:text-[clamp(3rem,5vw,3.75rem)] mt-5 font-baskervville`}
              >
                {corretor.nome}
              </h2>
              <p className="mt-3 mb-5">{corretor.setor}</p>
              <div className="lg:mr-10 flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 *:flex *:gap-2 *:items-center *:justify-center *:text-[1.0625rem] *:border-2 *:py-2 *:px-8 lg:px-0 lg:*:w-full *:rounded-lg">
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
                  <Link className="border-white" href="#">
                    <Image
                      src={Instagram}
                      alt="Instagram"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />{" "}
                    Instagram
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
        <section className="mt-12 mb-20">
          <div className="w-[min(90%,68rem)] mx-auto -mb-12">
            <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">
              Relacionados
            </span>
            <h2 className={`text-3xl font-baskervville`}>
              Imóveis Relacionados
            </h2>
          </div>
          <div className="w-full md:w-[min(90%,80rem)] mx-auto pt-12 relative">
            <Carousel estates={imoveisRelacionados.nodes} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default RealEstatePage;
