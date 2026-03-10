"use client";

import { useState, type ReactNode } from "react";
import Header from "@/components/header";
import { WhatsappButton } from "@/components/whatsapp-btn";
import Image from "next/image";
import PropertiesFilter from "./properties-filter";
import Bed from "/public/marqueseleao/cama.svg";
import ResizeIcon from "/public/marqueseleao/resize-icon.svg";
import HeartIcon from "/public/marqueseleao/heart-icon.svg";
import SelectedHeartIcon from "/public/marqueseleao/selected-heart-icon.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Empresa, Imóvel } from "smart-imob-types";
import { getFotoDestaque } from "@/utils/get-foto-destaque";
import { getSingleArea } from "@/utils/get-area";
import Pagination from "./pagination";
import { generateEstateUrl } from "@/utils/generate-estate-url";
import { getDisplayPrice } from "@/utils/get-display-price";
import NeighborhoodMap, { BairroContagem } from "./neighborhood-map";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";

const SORT_OPTIONS = [
  { label: "Relevantes", value: "" },
  { label: "Mais baratos", value: "price-asc" },
  { label: "Mais recentes", value: "newest" },
  { label: "Mais caros", value: "price-desc" },
  { label: "Mais vistos", value: "views" },
] as const;

const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

const MapsWrapper = ({ children }: { children: ReactNode }) => {
  if (!mapsApiKey) return <>{children}</>;
  return <APIProvider apiKey={mapsApiKey}>{children}</APIProvider>;
};

interface PropertyListProps {
  imoveis: Imóvel[];
  estados: any[];
  cidades: any[];
  bairros: any[];
  bairrosContagem: BairroContagem[];
  tipos: any[];
  codigos: any[];
  pages: number;
  page: number;
  pathname: string;
  query: any;
  filters: any[];
  empresa: Empresa;
}

const PropertyList: React.FC<PropertyListProps> = ({
  imoveis,
  estados,
  cidades,
  bairros,
  bairrosContagem,
  tipos,
  codigos,
  pages,
  page,
  pathname,
  query,
  filters,
  empresa,
}) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const router = useRouter();

  const currentSort = query?.sort || "";
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Relevantes";

  const handleSort = (value: string) => {
    setSortOpen(false);
    const segs = (filters || []).filter(
      (s: string) => !s.startsWith("sort-") && !s.startsWith("ordenacao-") && !s.startsWith("pagina-")
    );
    if (value) segs.push(`ordenacao-${value}`);
    router.push(segs.length > 0 ? `/imoveis/${segs.join("/")}` : "/imoveis");
  };

  const hasMap = !!mapsApiKey;

  return (
    <div className="bg-menu bg-no-repeat min-h-screen">
      <Header />
      <MapsWrapper>
        <main className="mt-28">
          {/* Filtros — largura total */}
          <div className="px-4 pb-6 relative z-[400]">
            <div className="relative w-full mb-6 mx-auto">
              <PropertiesFilter
                key={(filters || []).join("/")}
                estados={estados}
                cidades={cidades}
                bairros={bairros}
                tipos={tipos}
                codigos={codigos}
                searchParams={query}
                sortSlot={
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setSortOpen(!sortOpen)}
                      className={cn(
                        "w-full mt-2 flex items-center justify-center gap-2 border border-white/30 text-white px-4 py-3 rounded-xl text-sm transition-colors",
                        "md:mt-0 md:w-auto md:border-gray-300 md:text-gray-600 md:rounded-lg md:py-2 md:px-3 md:text-xs md:hover:border-gray-500"
                      )}
                    >
                      {currentSortLabel}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {sortOpen && (
                      <>
                        <div className="fixed inset-0 z-[250]" onClick={() => setSortOpen(false)} />
                        <ul className="absolute right-0 mt-2 z-[300] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[11rem]">
                          {SORT_OPTIONS.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => handleSort(opt.value)}
                                className={cn(
                                  "w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
                                  currentSort === opt.value && "text-[#530944] font-semibold bg-gray-50"
                                )}
                              >
                                {opt.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                }
              />
            </div>
            <div className="bg-white h-[2px]" />
          </div>

          {/* Layout Airbnb: lista (esq) + mapa fixo (dir) */}
          <div className="flex">

            {/* COLUNA ESQUERDA — lista de imóveis (scrollável) */}
            <div className={cn(
              "w-full pb-20 px-4",
              hasMap && "lg:w-[58%] xl:w-[55%]"
            )}>
              {imoveis.length === 0 ? (
                <p className="text-center text-lg font-semibold mt-10">
                  Nenhum imóvel disponível
                </p>
              ) : (
                <>
                  <ul className="w-full max-w-5xl mx-auto grid place-items-center sm:grid-cols-[repeat(auto-fill,minmax(20.875rem,1fr))] gap-4">
                    {imoveis.map((estate, index) => (
                      <li className="w-[min(100%,28.125rem)] relative z-[200]" key={estate.db_id}>
                        <div className="group block relative">
                          <div className="pt-5">
                            {(estate.caracteristicas || []).some(
                              (carac) => carac.nome === "Exclusividade"
                            ) && (
                                <div className="absolute z-10 top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">
                                  Exclusividade
                                </div>
                              )}
                            {estate.preço_venda_desconto &&
                              Number(estate.preço_venda_desconto) > 0 && (
                                <div className="absolute z-10 top-0 bg-[#095310] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">
                                  Imóvel com desconto
                                </div>
                              )}
                            <div className="relative">
                              <div className="absolute top-7 left-2 bg-white bg-opacity-70 text-black px-3 py-1 rounded-md z-[9]">
                                {estate.codigo}
                              </div>
                              <button
                                className="block absolute right-[5%] top-[7.5%]"
                                onClick={() => {
                                  if (!activeIndex.includes(index))
                                    return setActiveIndex([...activeIndex, index]);
                                  setActiveIndex(activeIndex.filter((i) => i !== index));
                                }}
                              >
                                {activeIndex.includes(index) ? (
                                  <Image
                                    className="w-8"
                                    src={SelectedHeartIcon}
                                    alt="Ícone de coração selecionado"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                ) : (
                                  <Image
                                    className="w-8"
                                    src={HeartIcon}
                                    alt="Ícone de coração"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                )}
                              </button>
                              <Link className="block" href={generateEstateUrl(estate)}>
                                <Image
                                  className="w-full rounded-lg h-[375px] w-[538px] relative"
                                  src={getFotoDestaque(estate, false, false) || ""}
                                  alt={estate.titulo || ""}
                                  width={538}
                                  height={375}
                                  style={{ maxWidth: "100%", height: "323px" }}
                                  priority={index < 2}
                                  quality={85}
                                />
                              </Link>
                            </div>
                            <Link
                              href={generateEstateUrl(estate)}
                              className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity"
                            >
                              <p className="font-semibold text-sm lg:text-base">
                                {getDisplayPrice(estate)}
                              </p>
                              <p className="text-[.75rem]">
                                {estate.bairro ? `${estate.bairro} /` : ""}{" "}
                                {estate.cidade?.nome}
                              </p>
                            </Link>
                            <Link
                              href={generateEstateUrl(estate)}
                              className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2"
                            >
                              <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
                                <span className="inline-flex gap-3 items-center">
                                  <Image
                                    src={ResizeIcon}
                                    alt="Seta que indica tamanho"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                  {getSingleArea(estate)}
                                </span>
                                {estate.dormitórios && !estate.não_mostrar_dormítorios ? (
                                  <span className="inline-flex gap-3 items-center">
                                    <Image
                                      src={Bed}
                                      alt="Cama"
                                      style={{ maxWidth: "100%", height: "auto" }}
                                    />{" "}
                                    {estate.dormitórios} quarto
                                    {Number(estate.dormitórios || 0) > 1 ? "s" : ""}
                                  </span>
                                ) : null}
                              </div>
                              <div className="w-[35%] flex items-center md:block text-center bg-mainPurple px-3">
                                Conhecer
                              </div>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Pagination
                    pages={pages}
                    page={page}
                    pathname={pathname}
                    query={query}
                    filters={filters}
                  />
                </>
              )}
            </div>

            {/* COLUNA DIREITA — mapa sticky (desktop) */}
            {hasMap && (
              <div className="hidden lg:block lg:w-[42%] xl:w-[45%] flex-shrink-0">
                <div className="sticky top-28 h-[calc(100vh-7rem)]">
                  <NeighborhoodMap
                    bairrosContagem={bairrosContagem}
                    filters={filters}
                  />
                </div>
              </div>
            )}

            {/* BOTÃO FLUTUANTE MAPA (MOBILE) */}
            {hasMap && !showMobileMap && (
              <button
                onClick={() => setShowMobileMap(true)}
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] bg-mainPurple text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Ver no Mapa
              </button>
            )}

            {/* OVERLAY MAPA (MOBILE) */}
            {showMobileMap && (
              <div className="fixed inset-0 z-[1000] bg-white lg:hidden">
                <button
                  onClick={() => setShowMobileMap(false)}
                  className="absolute z-10 top-6 left-6 bg-white w-12 aspect-square flex justify-center items-center shadow-lg rounded-[.625rem]"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <NeighborhoodMap
                  bairrosContagem={bairrosContagem}
                  filters={filters}
                />
              </div>
            )}
          </div>

          <WhatsappButton empresa={empresa} />
        </main>
      </MapsWrapper>
    </div>
  );
};

export default PropertyList;
