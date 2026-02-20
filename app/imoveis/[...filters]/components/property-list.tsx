"use client";

import { useState } from "react";
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
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  const bairrosComCoordenadas = bairrosContagem.filter((b) => b.lat !== 0 && b.lng !== 0);
  // O guard da API key fica dentro do NeighborhoodMap — aqui apenas checamos se há dados
  const hasMap = bairrosComCoordenadas.length > 0;

  return (
    <div className="bg-menu bg-no-repeat min-h-screen">
      <Header />

      <main className="mt-28">
        {/* Filtros — largura total */}
        <div className="px-4 pb-6">
          <div className="relative w-full mb-6 mx-auto">
            <PropertiesFilter
              estados={estados}
              cidades={cidades}
              bairros={bairros}
              tipos={tipos}
              codigos={codigos}
              searchParams={query}
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
                                priority
                                quality={100}
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
        </div>

        {/* Botão flutuante mobile para abrir/fechar mapa */}
        {hasMap && (
          <button
            onClick={() => setMobileMapOpen((v) => !v)}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#530944] text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm"
          >
            {mobileMapOpen ? "Ver lista" : "Ver no mapa"}
          </button>
        )}

        {/* Mapa fullscreen mobile */}
        {hasMap && mobileMapOpen && (
          <div className="lg:hidden fixed inset-0 top-0 z-40 bg-black">
            <div className="w-full h-full pt-20">
              <NeighborhoodMap bairrosContagem={bairrosContagem} filters={filters} />
            </div>
            <button
              onClick={() => setMobileMapOpen(false)}
              className="absolute top-24 left-4 bg-white text-black px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-50"
            >
              ← Voltar à lista
            </button>
          </div>
        )}

        <WhatsappButton empresa={empresa} />
      </main>
    </div>
  );
};

export default PropertyList;
