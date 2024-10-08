"use client";

import { useState } from "react";
import Header from "@/components/header";
import { WhatsappButton } from "@/components/whatsapp-btn";
import Image from "next/legacy/image";
import PropertyFilter from "@/components/property-filter";
import Bed from "/public/marqueseleao/cama.svg";
import ResizeIcon from "/public/marqueseleao/resize-icon.svg";
import HeartIcon from "/public/marqueseleao/heart-icon.svg";
import SelectedHeartIcon from "/public/marqueseleao/selected-heart-icon.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GoogleMap from "./google-map";
import { Imóvel } from "smart-imob-types";
import { getFotoDestaque } from "@/utils/get-foto-destaque";
import { getSingleArea } from "@/utils/get-area";
import { toBRL } from "@/utils/toBrl";

interface PropertyListProps {
  imoveis: Imóvel[];
  estados: any[];
  cidades: any[];
  bairros: any[];
  tipos: any[];
  codigos: any[];
}

const PropertyList: React.FC<PropertyListProps> = ({
  imoveis,
  estados,
  cidades,
  bairros,
  tipos,
  codigos,
}) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);
  const [openMap, setOpenMap] = useState(false);

  const handleCloseMap = () => setOpenMap(false);

  const defaultCenterImovel = Object.values(imoveis).find(
    (imovel) => imovel.lat && imovel.long
  );

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-28 mb-10">
        <section className="relative">
          <button
            onClick={() => setOpenMap(true)}
            className={cn(
              "bg-mainPurple z-[51] lg:hidden px-5 py-1 rounded-full fixed right-1/2 translate-x-1/2 bottom-[2.5%]",
              openMap && "hidden"
            )}
          >
            Mapa
          </button>
          <div className="lg:max-w-[57.5vw]">
            <div className="relative z-20 w-[min(90%,80rem)] mb-20 mx-auto">
              <PropertyFilter
                estados={estados}
                cidades={cidades}
                bairros={bairros}
                tipos={tipos}
                codigos={codigos}
              />
            </div>
            <div className="bg-white h-[2px] mt-10 mb-6"></div>

            {imoveis.length === 0 ? (
              <p className="text-center text-lg font-semibold mt-10">
                Nenhum imóvel disponível
              </p>
            ) : (
              <>
                <ul className="w-[min(90%,80rem)] mx-auto grid place-items-center sm:grid-cols-[repeat(auto-fill,minmax(20.875rem,1fr))] gap-4">
                  {imoveis.map((estate, index) => (
                    <li className="w-[min(100%,28.125rem)]" key={estate.db_id}>
                      <div className="group block relative">
                        <div className="pt-5">
                          {estate.destaque && (
                            <div className="absolute z-10 top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">
                              EXCLUSIVIDADE
                            </div>
                          )}
                          {estate.preço_venda_desconto &&
                            Number(estate.preço_venda_desconto) > 0 && (
                              <div className="absolute z-10 top-0 bg-[#095310] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">
                                IMÓVEL COM DESCONTO
                              </div>
                            )}
                          <div className="relative">
                            <button
                              className="block absolute right-[5%] top-[7.5%]"
                              onClick={() => {
                                if (!activeIndex.includes(index))
                                  return setActiveIndex([
                                    ...activeIndex,
                                    index,
                                  ]);
                                setActiveIndex(
                                  activeIndex.filter((i) => i !== index)
                                );
                              }}
                            >
                              {activeIndex.includes(index) ? (
                                <Image
                                  className="w-8"
                                  src={SelectedHeartIcon}
                                  alt="Ícone de coração selecionado"
                                />
                              ) : (
                                <Image
                                  className="w-8"
                                  src={HeartIcon}
                                  alt="Ícone de coração"
                                />
                              )}
                            </button>
                            <Link
                              className="block"
                              href={`/imoveis/${estate.db_id}`}
                            >
                              <Image
                                className="w-full rounded-lg h-[375px] w-[538px] relative"
                                src={getFotoDestaque(estate) || ""}
                                alt={estate.titulo || ""}
                                width={538}
                                height={375}
                              />
                            </Link>
                          </div>
                          <Link
                            href={`/imoveis/${estate.db_id}`}
                            className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity"
                          >
                            {estate.preço_venda &&
                            (estate.venda_exibir_valor_no_site === undefined ||
                              estate.venda_exibir_valor_no_site === true) ? (
                              <p className="font-semibold text-sm lg:text-base">
                                {toBRL(estate.preço_venda)}
                              </p>
                            ) : (
                              <p className="font-semibold text-sm lg:text-base">
                                Consulte-nos
                              </p>
                            )}

                            <p className="text-[.75rem]">
                              {estate.bairro ? `${estate.bairro} /` : ""}{" "}
                              {estate.cidade?.nome}
                            </p>
                          </Link>
                          <Link
                            href={`/imoveis/${estate.db_id}`}
                            className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2"
                          >
                            <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
                              <span className="inline-flex gap-3 items-center">
                                <Image
                                  src={ResizeIcon}
                                  alt="Seta que indica tamanho"
                                />
                                {getSingleArea(estate)}
                              </span>
                              <span className="inline-flex gap-3 items-center">
                                <Image src={Bed} alt="Cama" />{" "}
                                {estate.dormitórios} quarto
                                {`${
                                  Number(estate.dormitórios || 0) > 1 ? "s" : ""
                                }`}
                              </span>
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

                {/* Paginação que aparece em todas as telas */}
                <div className="flex justify-center mt-12 items-center gap-3">
                  <div className="bg-mainPurple w-10 h-10 grid place-items-center rounded-lg cursor-pointer">
                    1
                  </div>
                  <div className="border border-white w-10 h-10 grid place-items-center rounded-lg cursor-pointer">
                    2
                  </div>
                  <div className="border border-white w-10 h-10 grid place-items-center rounded-lg cursor-pointer">
                    3
                  </div>
                  <div className="border border-white w-10 h-10 grid place-items-center rounded-lg cursor-pointer">
                    4
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className={cn(
              "lg:w-[42.5vw] lg:h-full fixed lg:right-0 lg:top-0 bg-black z-20",
              openMap
                ? "inset-[10rem_0rem_2rem_0rem] sm:inset-[10rem_4rem_2rem_4rem] md:inset-[10rem_5rem_2rem_5rem] lg:inset-[0_0_auto_auto]"
                : ""
            )}
          >
            <GoogleMap
              closeMap={handleCloseMap}
              imoveis={imoveis}
              bairros={bairros}
              defaultCenter={defaultCenterImovel}
            />
          </div>
          <WhatsappButton />
        </section>
      </main>
    </div>
  );
};

export default PropertyList;
