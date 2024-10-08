"use client";

import UseEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { comentarios } from "@/data";
import Image from "next/image";
import Stars from "/public/marqueseleao/stars.svg";
import { useCallback, useEffect, useState } from "react";
import { Depoimento } from "smart-imob-types";

const TestimonialsCarousel = ({
  depoimentos,
}: {
  depoimentos: Depoimento[];
}) => {
  if (!depoimentos || depoimentos.length === 0) return null;

  const [emblaRef, emblaApi] = UseEmblaCarousel({ dragFree: true });
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
    return emblaApi.scrollProgress();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll(emblaApi);
    emblaApi
      .on("reInit", onScroll)
      .on("scroll", onScroll)
      .on("slideFocus", onScroll);
  }, [emblaApi, onScroll]);

  return (
    <div>
      <div className="flex w-[min(90%,68rem)] mx-auto">
        <div>
          <span className="text-[#898989] flex gap-4 items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">
            Depoimentos
          </span>
          <h2 className={`text-4xl font-baskervville`}>
            Veja alguns comentários dos nossos clientes
          </h2>
        </div>
        <div className="hidden md:block bg-[#3E3E3E] relative mt-auto mb-2 w-full h-[3px]">
          <div
            className={`absolute bg-white h-full w-full origin-left scale-x-[30%]`}
          ></div>
        </div>
      </div>
      <div className="embla w-[min(100%,calc((13.825rem+1.5rem)*4))] overflow-x-hidden mt-8">
        <div className="embla__viewport" ref={emblaRef}>
          <ul className="embla__container ml-4 gap-6">
            {depoimentos.map((depoimento) => (
              <li
                className="rounded-[1.25rem] flex-shrink-0 flex-grow-0 bg-white px-6 pt-6 pb-4 text-black text-center font-semibold w-[min(100%,13.825rem)] overflow-hidden"
                key={depoimento.id}
              >
                <blockquote className="w-full h-full max-w-[20ch]">
                  <Image
                    className="mx-auto mb-4"
                    width={58}
                    height={58}
                    src={depoimento.foto}
                    alt="Foto de perfil"
                  />
                  <p className="leading-5">{depoimento.texto}</p>
                  <Image className="mx-auto my-3" src={Stars} alt="Estrelas" />
                  <p className="text-[#707070]">{depoimento.nome}</p>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="block w-[min(90%,68rem)] mx-auto md:hidden bg-[#3E3E3E] relative mt-12 h-[3px]">
        <div
          className={`absolute bg-white h-full w-full origin-left scale-x-[30%]`}
        ></div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
