"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { useCallback, useEffect, useRef } from "react"

import { imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"
import ArrowLeft from "/public/marqueseleao/arrow-left.webp"
import ArrowRight from "/public/marqueseleao/arrow-right.webp"

const SelectedForYou = () => {
  const FeaturedProperties = imoveis.filter((imovel) => imovel.categoria === "destaque");

  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {FeaturedProperties.map((featuredProperty) => (
            <Link href={`/imoveis/${featuredProperty.id}`} className="embla__slide relative" key={featuredProperty.id}>
              <div className="embla__slide__number pt-5">
                {featuredProperty.exclusividade ?
                  <div className="absolute top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-md rounded-tl-md">EXCLUSIVIDADE</div>
                  : null}
                {featuredProperty.desconto ? <div className="absolute -top-4 bg-[#095310] py-[.35rem] px-4 rounded-r-md rounded-tl-md">imóvel COM DESCONTO</div> : null}
                <Image
                  className="w-full rounded-md"
                  src={featuredProperty.fotos[0]}
                  alt={featuredProperty.titulo}
                  width={550}
                  height={350}
                />
                <div className="flex items-center justify-between bg-[rgb(0,0,0,0.3)] p-2 absolute bottom-0 w-full left-0">
                  <p className="font-bold">R$ {featuredProperty.valores.precoVenda}</p>
                  <p className="text-sm">{featuredProperty.bairro} / {featuredProperty.cidade}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button className="embla__prev absolute top-1/2 translate-y-1/2 left-0" onClick={scrollPrev}>
        <Image
          src={ArrowLeft}
          alt="Seta para esquerda"
        />
      </button>
      <button className="embla__next absolute top-1/2 translate-y-1/2 right-0" onClick={scrollNext}>
        <Image
          src={ArrowRight}
          alt="Seta para direita"
        />
      </button>
    </div>

  )
}

export default SelectedForYou