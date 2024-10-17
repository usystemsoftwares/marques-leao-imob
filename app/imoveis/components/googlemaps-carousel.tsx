"use client";

import UseEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import Bed from "/public/marqueseleao/cama.svg";
import ResizeIcon from "/public/marqueseleao/resize-icon.svg";
import ArrowLeft from "/public/marqueseleao/arrow-left.webp";
import ArrowRight from "/public/marqueseleao/arrow-right.webp";

import HeartIcon from "/public/marqueseleao/heart-icon.svg";
import SelectedHeartIcon from "/public/marqueseleao/selected-heart-icon.svg";
import { Imóvel } from "smart-imob-types";
import { toBRL } from "@/utils/toBrl";
import { getSingleArea } from "@/utils/get-area";
import { getFotoDestaque } from "@/utils/get-foto-destaque";

type CarouselProps = {
  estates: Imóvel[];
};

const GoogleMapsCarousel = ({ estates }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {estates.map((estate, index) => (
            <div
              key={estate.db_id}
              className={
                "group flex-shrink-0 flex-grow-0 w-[min(100%,27.813rem)] relative"
              }
            >
              <div className="embla__slide__number pt-5">
                <div className="relative">
                  <div className="absolute top-7 left-2 bg-white bg-opacity-70 text-black px-3 py-1 rounded-md z-[99]">
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    ) : (
                      <Image
                        className="w-8"
                        src={HeartIcon}
                        alt="Ícone de coração"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    )}
                  </button>
                  <Link className="block" href={`/imoveis/${estate.db_id}`}>
                    <Image
                      className="w-full rounded-lg h-[375px] w-[538px] relative"
                      src={getFotoDestaque(estate) || ""}
                      alt={estate.titulo || ""}
                      width={538}
                      height={375}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                      {getSingleArea(estate)}
                    </span>
                    {estate.dormitórios && !estate.não_mostrar_dormítorios && (
                      <span className="inline-flex gap-3 items-center">
                        <Image
                          src={Bed}
                          alt="Cama"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />{" "}
                        {estate.dormitórios} quarto
                        {`${Number(estate.dormitórios || 0) > 1 ? "s" : ""}`}
                      </span>
                    )}
                  </div>
                  <div className="w-[35%] flex items-center lg:block text-center bg-mainPurple px-3">
                    Conhecer
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {emblaApi?.canScrollPrev() && (
        <button
          className="embla__prev absolute top-1/2 translate-y-1/2 left-[5%]"
          onClick={scrollPrev}
        >
          <Image
            src={ArrowLeft}
            alt="Seta para esquerda"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </button>
      )}

      {emblaApi?.canScrollNext() && (
        <button
          className="embla__next absolute top-1/2 translate-y-1/2 right-[5%]"
          onClick={scrollNext}
        >
          <Image
            src={ArrowRight}
            alt="Seta para direita"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </button>
      )}
    </div>
  );
};

export default GoogleMapsCarousel;
