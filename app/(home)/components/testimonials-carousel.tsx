"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType } from "embla-carousel"
import { comentarios } from "@/data"
import Image from "next/image"
import Stars from "/public/marqueseleao/stars.svg"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const TestimonialsCarousel = () => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ dragFree: true })
  const [scrollNumber, setScrollNumber] = useState<number>()

  const scrollProgressBar = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollNumber(emblaApi.scrollProgress())
    return emblaApi.scrollProgress()
  }, [])

  useEffect(() => {
    if (emblaApi) emblaApi.on('scroll', scrollProgressBar)
  }, [emblaApi, scrollProgressBar])

  /* use transform scaleeee */

  return (
    <div className="embla overflow-x-hidden mt-8">
      <div className={`bg-red-700 h-2`}></div>
      <div className="embla__viewport" ref={emblaRef}>
        <ul className="embla__container gap-7">
          {comentarios.map(comentario => (
            <li
              className="rounded-[1.25rem] flex-shrink-0 flex-grow-0 bg-white px-6 pt-8 pb-6 text-black text-center font-semibold w-[min(100%,15.625rem)] overflow-hidden"
              key={comentario.id}>
              <blockquote className="w-full h-full max-w-[20ch]">
                <Image
                  className="mx-auto mb-4"
                  width={58}
                  height={58}
                  src={comentario.imagem}
                  alt="Foto de perfil"
                />
                <p>{comentario.comentario}</p>
                <Image
                  className="mx-auto my-3"
                  src={Stars}
                  alt="Estrelas"
                />
                <p className="text-[#707070]">{comentario.nome}</p>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TestimonialsCarousel