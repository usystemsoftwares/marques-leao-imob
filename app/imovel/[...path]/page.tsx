import Header from "@/components/header";
import Image from "next/image";
import Carousel from "@/components/carousel";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import { generatePropertyTitle, generatePropertyDescription, generatePropertyStructuredData } from "@/utils/seo-utils";
import { generateRichDescription } from "@/utils/generate-rich-description";

import Ellipse from "/public/marqueseleao/ellipse4.webp";

import LocationIcon from "/public/marqueseleao/location-icon.svg";

import EstateBedIcon from "/public/marqueseleao/estate-bed-icon.svg";
import BathIcon from "/public/marqueseleao/bath-icon.svg";
import CarIcon from "/public/marqueseleao/car-icon.svg";
import DimensionIcon from "/public/marqueseleao/dimension-icon.svg";
import SketchIcon from "/public/marqueseleao/construction.png";
import BrickwallhIcon from "/public/marqueseleao/brickwall.png";

import CheckIcon from "/public/marqueseleao/check-icon.svg";

import Whatsapp from "/public/marqueseleao/white-wpp-icon.svg";
import Instagram from "/public/marqueseleao/instagram-icon.svg";
import PropertiesFilter from "../../imoveis/[...filters]/components/properties-filter";
import { notFound } from "next/navigation";
import { Corretor, Empreendimento, Empresa, Imóvel } from "smart-imob-types";
import getWhatsappLink from "@/utils/generate_phone_href";
import { toBRL } from "@/utils/toBrl";
import PropertyPhotos from "../../imoveis/[...filters]/components/property-photos";
import processarFiltros from "@/utils/processar-filtros-backend";
import { Metadata, ResolvingMetadata } from "next";
import { getFotoDestaque } from "@/utils/get-foto-destaque";
import { PropertyViewer } from "@/components/viewer";

function extractCodigoFromUrl(path: string[] | string): string {
  // Aceita dois formatos:
  // 1. Novo formato: apartamento-no-bairro-riviera-em-bertioga-com-4-suites-AP10358
  //    O código está sempre no final após o último hífen
  // 2. Formato antigo: casa/novo-hamburgo/petropolis/3-dormitórios/3-vagas/1167
  //    O código é o último segmento do array
  const pathArray = Array.isArray(path) ? path : [path];

  // Se houver múltiplos segmentos separados por /, usar o último
  if (pathArray.length > 1) {
    return pathArray[pathArray.length - 1];
  }

  // Se houver apenas um segmento, dividir por hífen e pegar o último
  const fullPath = pathArray.join("/");
  const parts = fullPath.split("-");
  return parts[parts.length - 1];
}

export async function generateMetadata(
  params: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parseJSON = async (response: Response) => {
    try {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          `Invalid content-type: expected application/json, got ${contentType}`
        );
        const text = await response.text();
        console.error("Response body:", text.substring(0, 500));
        return null;
      }

      const text = await response.text();
      if (!text) {
        console.error("Empty response body");
        return null;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Invalid JSON:", text.substring(0, 500));
        return null;
      }
    } catch (error) {
      console.error("Failed to process response:", error);
      return null;
    }
  };

  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const path = Array.isArray(params?.params?.path)
    ? params.params.path
    : Array.isArray(params?.path)
    ? params.path
    : [];
  const codigo: any = extractCodigoFromUrl(path);
  const queryParams = new URLSearchParams({
    empresa_id,
  });
  
  try {
    const dataImovel = await fetchWithRetry(
      `${uri}/imoveis/site/codigo/${codigo}?${queryParams.toString()}`,
      {
        next: { tags: [`imovel-${codigo}`] },
      }
    );
    const dataEmpresa = await fetchWithRetry(
      `${uri}/empresas/site/${empresa_id}`,
      {
        next: { tags: ["empresas"] },
      }
    );

    if (!dataEmpresa.ok || !dataImovel.ok) {
      notFound();
    }
    const imovel: Imóvel = await parseJSON(dataImovel) || {};
    const empresa: Empresa = await parseJSON(dataEmpresa) || {};
    const firstImage = getFotoDestaque(imovel, true) || "";
    
    // SEO otimizado para imóveis
    const title = generatePropertyTitle(imovel, empresa);
    const description = generatePropertyDescription(imovel);
    
    // Keywords específicas do imóvel
    const keywords = [
      imovel.tipo,
      `${imovel.tipo} em ${imovel.cidade?.nome}`,
      `${imovel.tipo} ${imovel.bairro}`,
      imovel.venda ? "venda" : "locação",
      "imóvel de luxo",
      "alto padrão",
      imovel.bairro,
      imovel.cidade?.nome,
      "Novo Hamburgo",
      "MARQUES & LEÃO"
    ].filter(Boolean).join(", ");
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "website",
        images: firstImage ? [{ url: firstImage }] : [],
        locale: "pt_BR",
        siteName: "MARQUES & LEÃO Imobiliária",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: firstImage ? [firstImage] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marqueseleao.com.br'}/imovel/${path.join('/')}/${codigo}`,
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Imóvel - MARQUES & LEÃO Imobiliária",
      description: "Encontre o imóvel dos seus sonhos com a MARQUES & LEÃO Imobiliária",
    };
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 15000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      console.error(
        `Fetch attempt ${i + 1} failed for ${url}:`,
        error.message
      );

      if (i === retries - 1) {
        throw error;
      }

      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function getData(
  codigo: string,
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
  estados: any[];
  cidades: any[];
  bairros: any[];
  tipos: any[];
  codigos: any[];
}> {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const queryParams = new URLSearchParams({
    empresa_id,
  });
  const dataImovel = await fetchWithRetry(
    `${uri}/imoveis/site/codigo/${codigo}?${queryParams.toString()}`,
    {
      next: { tags: [`imovel-${codigo}`] },
    }
  );
  const empresa = await fetchWithRetry(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"] },
  });

  if (!empresa.ok || !dataImovel.ok) {
    notFound();
  }

  const parseJSON = async (response: Response) => {
    try {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          `Invalid content-type: expected application/json, got ${contentType}`
        );
        const text = await response.text();
        console.error("Response body:", text.substring(0, 500));
        return null;
      }

      const text = await response.text();
      if (!text) {
        console.error("Empty response body");
        return null;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Invalid JSON:", text.substring(0, 500));
        return null;
      }
    } catch (error) {
      console.error("Failed to process response:", error);
      return null;
    }
  };

  const imovel = await parseJSON(dataImovel);
  const corretor = imovel?.agenciador_id
    ? await fetchWithRetry(
        `${uri}/corretores/${afiliado || imovel.agenciador_id}`,
        {
          next: { tags: [`corretores-${afiliado || imovel.agenciador_id}`] },
        }
      ).then(parseJSON)
    : null;

  const temporada = imovel?.temporada
    ? await fetchWithRetry(`${uri}/reservas/imovel/${imovel.db_id}`, {
        next: { tags: [`reservas-${imovel.db_id}`] },
      }).then(parseJSON)
    : null;

  const empreendimento = imovel?.empreendimento_id
    ? await fetchWithRetry(
        `${uri}/empreendimentos/${imovel.empreendimento_id}`,
        {
          next: { tags: [`empreendimento-${imovel.empreendimento_id}`] },
        }
      ).then(parseJSON)
    : null;

  const params_imoveis = new URLSearchParams({
    limit: "24",
    startAt: "0",
    filtros: JSON.stringify(
      processarFiltros({
        relacionados: imovel.db_id,
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

  const imoveisResponse = await fetchWithRetry(
    `${uri}/imoveis/site/paginado?${params_imoveis.toString()}`,
    {
      next: { tags: ["imoveis-paginado"] },
    }
  );

  const responseEstados = await fetchWithRetry(
    `${uri}/estados?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const responseBairros = await fetchWithRetry(
    `${uri}/imoveis/bairros-por-cidade?${queryParams.toString()}`,
    {
      next: { tags: ["imoveis-info"], revalidate: 3600 },
    }
  );

  const paramsCidades = new URLSearchParams({
    empresa_id,
    site: "1",
  });
  const cidades = await fetchWithRetry(
    `${uri}/cidades?${paramsCidades.toString()}`,
    {
      next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
    }
  );

  if (!responseEstados.ok || !responseBairros.ok || !cidades.ok) {
    throw new Error("Failed to fetch data");
  }

  const responseTipos = await fetchWithRetry(
    `${uri}/imoveis/tipos?${queryParams.toString()}`,
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

  const responseCodigos = await fetchWithRetry(
    `${uri}/imoveis/codigos?${queryParams.toString()}`,
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
    imoveisRelacionados: (await parseJSON(imoveisResponse)) || { nodes: [], total: 0 },
    bairros: (await parseJSON(responseBairros)) || [],
    estados: (await parseJSON(responseEstados)) || [],
    cidades: (await parseJSON(cidades)) || [],
    tipos: (await parseJSON(responseTipos)) || [],
    codigos: (await parseJSON(responseCodigos)) || [],
  };
}

const RealEstatePage = async ({
  params,
  searchParams,
}: {
  params: { path: string[] };
  searchParams: { [key: string]: any };
}) => {
  const path = Array.isArray(params?.path) ? params.path : [];
  const codigo: any = extractCodigoFromUrl(path);

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
    bairros,
    tipos,
    codigos,
  } = await getData(codigo, afiliado);

  if (!imovel) return <></>;
  
  // Gerar structured data para o imóvel
  const propertyStructuredData = generatePropertyStructuredData(imovel, empresa);

  return (
    <div className="bg-menu bg-no-repeat">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyStructuredData) }}
      />
      
      <Header />
      <PropertiesFilter
        estados={estados}
        cidades={cidades}
        bairros={bairros}
        codigos={codigos}
        tipos={tipos}
        searchParams={searchParams}
        className="hidden lg:flex w-[min(100%,31.875rem)] absolute mt-14 top-0 right-1/2 translate-x-[75%]"
      />
      <main className="mt-8">
        {/* Breadcrumb Navigation */}
        <div className="max-w-[80rem] mx-auto px-4 md:px-6 lg:px-0 mb-6">
          <Breadcrumb 
            items={[
              { name: "Imóveis", url: "/imoveis" },
              { name: imovel.cidade?.nome || "Cidade", url: `/imoveis/${imovel.cidade?.nome?.toLowerCase().replace(/\s+/g, '-')}` },
              { name: imovel.bairro || "Bairro", url: `/imoveis/${imovel.cidade?.nome?.toLowerCase().replace(/\s+/g, '-')}/${imovel.bairro?.toLowerCase().replace(/\s+/g, '-')}` },
              { name: `${imovel.tipo} - Cód ${imovel.codigo}` }
            ]}
          />
        </div>
        
        <section>
          <PropertyPhotos
            empresa={empresa}
            imovel={imovel}
            afiliado={afiliado}
            liberado={!!uid || VerFotos || false}
            VerFotos={VerFotos}
          />
        </section>
        <section className="relative w-full mx-auto mt-16 lg:flex lg:gap-28 px-4 md:px-6 lg:px-0 max-w-[80rem]">
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
          <div className="lg:w-2/3">
            <div className="mb-8">
              <span className="text-[#707070]">
                {imovel.tipo} à venda · {imovel.estado?.nome} ·
                {imovel.cidade?.nome} · Cód {imovel.codigo}
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
                  {(imovel.tipo || "").toLowerCase()} para comprar em
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
                />
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
                    />
                    Área do Terreno <br />
                    <strong>{imovel.area_terreno}</strong> m
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
                    />
                    Área privativa <br />
                    <strong>{imovel.area_privativa}</strong> m
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
                    />
                    <strong>{imovel.dormitórios}</strong> dormitórios
                    {imovel.suítes ? (
                      <>
                        <br />
                        <strong>{imovel.suítes}</strong> suítes
                      </>
                    ) : (
                      ""
                    )}
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
                    <strong>{imovel.vagas}</strong> vagas <br /> de garagem
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
                    />
                    <strong>{imovel.banheiros}</strong> banheiros
                  </li>
                ) : (
                  <></>
                )}
                {imovel.ano_de_construcao ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={SketchIcon}
                      alt="ano_de_construcao"
                      style={{
                        maxWidth: "26px",
                        height: "auto",
                        backgroundColor: "transparent",
                      }}
                    />
                    Ano de Construção
                    <br />
                    <strong>{imovel.ano_de_construcao}</strong>
                  </li>
                ) : (
                  <></>
                )}
                {(imovel as any).andar && !(imovel as any).não_mostrar_andar ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={BrickwallhIcon}
                      alt="andar"
                      style={{
                        maxWidth: "26px",
                        height: "auto",
                        backgroundColor: "transparent",
                      }}
                    />
                    Andar
                    <br />
                    <strong>{(imovel as any).andar}º</strong>
                  </li>
                ) : (
                  <></>
                )}
                {imovel.data_de_entrega ? (
                  <li>
                    <Image
                      className="mx-auto mb-3"
                      src={BrickwallhIcon}
                      alt="data_de_entrega"
                      style={{
                        maxWidth: "26px",
                        height: "auto",
                        backgroundColor: "transparent",
                      }}
                    />
                    Data de entrega
                    <br />
                    <strong>
                      {new Date(imovel.data_de_entrega).toLocaleDateString(
                        "pt-BR",
                        {
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </strong>
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
              <div className="text-[#E9E9E9] text-lg font-light whitespace-pre-wrap">
                {imovel["descrição"] ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: imovel["descrição"] }}
                  ></div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: generateRichDescription(imovel) }}
                  ></div>
                )}
              </div>
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
            <div className="mt-12 lg:mt-0 lg:w-1/3">
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
                  priority
                  quality={100}
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
                    />
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
                    />
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
            <Carousel estates={imoveisRelacionados.nodes} logo={empresa.logo || ''} />
          </div>
        </section>
      </main>
      {empresa.liberar_viewr &&
        imovel.viewer &&
        (imovel.viewer || []).length > 0 && (
          <PropertyViewer viewer={imovel.viewer || []} />
        )}
    </div>
  );
};

export default RealEstatePage;
