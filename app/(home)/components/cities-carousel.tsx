"use client"

import UseEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import CampoBom from "/public/marqueseleao/campo-bom.webp"
import NovoHamburgo from "/public/marqueseleao/novo-hamburgo.webp"
import SantaCatarina from "/public/marqueseleao/santa-catarina.webp"
import EstanciaVelha from "/public/marqueseleao/estancia-velha.webp"
import Link from "next/link"

const CitiesCarousel = () => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ dragFree: true })

  return (
    <div className={`embla overflow-x-hidden font-baskervville mt-8`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container *:w-[min(100%,16.875rem)] *:cursor-pointer *:h-[9.313rem] *:md:h-auto *:overflow-hidden *:rounded-[.625rem] md:*:rounded-lg *:relative *:flex-shrink-0 *:flex-grow-0 gap-6 md:gap-12">
          <Link
            href="/imoveis?cidade.nome=Novo Hamburgo"
            className="group"
          >
            <Image
              src={NovoHamburgo}
              alt="Novo Hamburgo prédios"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <p className="absolute b-0 text-center w-full py-2 bg-mainPurple bg-opacity-60 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">Conhecer imóveis</p>
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60 group-hover:opacity-0 transition-opacity">Novo Hamburgo</p>
          </Link>
          <Link
            href="/imoveis?cidade.nome=Campo Bom"
            className="group"
          >
            <Image
              src={CampoBom}
              alt="Campo bom paisagem"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <p className="absolute b-0 text-center w-full py-2 bg-mainPurple bg-opacity-60 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">Conhecer imóveis</p>
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60 group-hover:opacity-0 transition-opacity">Campo Bom</p>
          </Link>
          <Link
            href="/imoveis?cidade.nome=Estancia Velha"
            className="group"
          >
            <Image
              src={EstanciaVelha}
              alt="Estancia Velha paisagem"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <p className="absolute b-0 text-center w-full py-2 bg-mainPurple bg-opacity-60 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">Conhecer imóveis</p>
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60 group-hover:opacity-0 transition-opacity">Estancia Velha</p>
          </Link>
          <Link
            href="/imoveis?estado.nome=Santa Catarina"
            className="group"
          >
            <Image
              src={SantaCatarina}
              alt="Santa Catarina paisagem"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <p className="absolute b-0 text-center w-full py-2 bg-mainPurple bg-opacity-60 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">Conhecer imóveis</p>
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60 group-hover:opacity-0 transition-opacity">Santa Catarina</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CitiesCarousel