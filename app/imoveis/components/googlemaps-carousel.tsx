"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { useCallback } from "react"

import { imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"

import EstateImage from "/public/marqueseleao/imovel-1.webp"
import Bed from "/public/marqueseleao/cama.svg"
import ResizeIcon from "/public/marqueseleao/resize-icon.svg"
import ArrowLeft from "/public/marqueseleao/arrow-left.webp"
import ArrowRight from "/public/marqueseleao/arrow-right.webp"

type Estates = typeof imoveis

type CarouselProps = {
  estates: Estates
}

const GoogleMapsCarousel = ({ estates }: CarouselProps) => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return
    emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {estates.map((estate) => (
            <Link
              key={estate.id}
              className={"group flex-shrink-0 flex-grow-0 w-[min(100%,27.813rem)] relative"}
              href={`/imoveis/${estate.id}`}
            >
              <div className="embla__slide__number pt-5">
                {estate.exclusividade &&
                  <div className="absolute top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">EXCLUSIVIDADE</div>
                }
                {estate.desconto &&
                  <div className="absolute -top-4 bg-[#095310] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">imóvel COM DESCONTO</div>
                }
                <Image
                  className="w-full"
                  src={EstateImage}
                  alt={estate.titulo}
                />
                <div className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity">
                  <p className="font-semibold text-sm lg:text-base">R$ {estate.valores.precoVenda}</p>
                  <p className="text-[.75rem]">{estate.bairro} / {estate.cidade}</p>
                </div>
                <div className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2">
                  <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
                    <span className="inline-flex gap-3 items-center">
                      <Image
                        src={ResizeIcon}
                        alt="Seta que indica tamanho"
                      />
                      {estate.informacoes.areaTerro}m
                    </span>
                    <span className="inline-flex gap-3 items-center">
                      <Image
                        src={Bed}
                        alt="Cama"
                      /> {estate.informacoes.dormitorios} quartos
                    </span>
                  </div>
                  <div className="w-[35%] flex items-center lg:block text-center bg-mainPurple px-3">Conhecer</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {emblaApi?.canScrollPrev() && (
        <button className="embla__prev absolute top-1/2 translate-y-1/2 left-[5%]" onClick={scrollPrev}>
          <Image
            src={ArrowLeft}
            alt="Seta para esquerda"
          />
        </button>
      )}

      {emblaApi?.canScrollNext() && (
        <button className="embla__next absolute top-1/2 translate-y-1/2 right-[5%]" onClick={scrollNext}>
          <Image
            src={ArrowRight}
            alt="Seta para direita"
          />
        </button>
      )}
    </div>
  )
}

export default GoogleMapsCarousel