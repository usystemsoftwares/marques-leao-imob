"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import Image from "next/image"
import CampoBom from "/public/marqueseleao/campo-bom.webp"
import NovoHamburgo from "/public/marqueseleao/novo-hamburgo.webp"
import SantaCatarina from "/public/marqueseleao/santa-catarina.webp"
import EstanciaVelha from "/public/marqueseleao/estancia-velha.webp"
import { Baskervville } from "next/font/google"

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"]
});

const CitiesCarousel = () => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })

  return (
    <div className={`embla ${baskervville.className} mt-8`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container justify-center gap-12">
          <div className="relative w-[16.875rem]">
            <Image
              className="rounded-xl"
              src={NovoHamburgo}
              alt="Novo Hamburgo prédios"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[rgb(0,0,0,0.3)]">Novo Hamburgo</p>
          </div>
          <div className="relative w-[16.875rem]">
            <Image
              className="rounded-xl"
              src={CampoBom}
              alt="Campo bom paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[rgb(0,0,0,0.3)]">Campo Bom</p>
          </div>
          <div className="relative w-[16.875rem]">
            <Image
              className="rounded-xl"
              src={EstanciaVelha}
              alt="Estancia Velha paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[rgb(0,0,0,0.3)]">Estancia Velha</p>
          </div>
          <div className="relative w-[16.875rem]">
            <Image
              className="rounded-xl"
              src={SantaCatarina}
              alt="Santa Catarina paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[rgb(0,0,0,0.3)]">Santa Catarina</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitiesCarousel