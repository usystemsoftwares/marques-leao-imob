"use client"

import Image from "next/image"
import PabloEGabriel from "/public/marqueseleao/foto-pablo-e-gabriel.webp"
import { useState } from "react"
import { cn } from "@/lib/utils"

const MarquesAndLeaoImg = () => {
  const [showPablo, setShowPablo] = useState(false)
  const [showGabriel, setShowGabriel] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowPablo(!showPablo)}
        className="absolute top-[2%] left-[3%] bg-black/45 z-10 px-5 py-2 rounded-[100vmax]"
      >Conhecer Pablo</button>
      <div className={cn("hidden bg-white/80 text-black absolute left-0 top-0 w-full h-full", showPablo && "block [clip-path:polygon(100%_0,100%_0,14.5%_100%,0_100%,0_0)]")}>
        <div className="float-right w-full aspect-square [shape-outside:polygon(100%_0,17%_100%,100%_100%)]"></div>
        <div>
          <p className="ml-10 mt-16 font-bold text-3xl font-baskervville">Pablo Marques</p>
          <p className="ml-10 mt-2 text-[.75rem] md:text-base lg:text-xl">Atuando a mais de 12 anos no mercado imobiliário, tive o privilégio de impactar dezenas de pessoas ao longo da minha trajetório, o que me trouxe expertise quando o assunto é imóveis e transformação de vidas. Com foco em imóveis de médio e alto padrão na região de Novo Hamburgo e Campo Bom, sou especialista em ativos imobiliários e estratégias de marketing imobiliário.</p>
        </div>
      </div>
      <Image
        className="rounded-[.625rem]"
        src={PabloEGabriel}
        alt="Pablo Marques e Gabriel Leão"
      />
      <button
        onClick={() => setShowGabriel(!showGabriel)}
        className="absolute bottom-[2%] right-[3%] bg-black/45 z-10 px-5 py-2 rounded-[100vmax]"
      >Conhecer Gabriel</button>
      <div className={cn("hidden absolute bg-mainPurple/80 right-0 bottom-0 w-full h-full", showGabriel && "block [clip-path:polygon(100%_0,14.6%_100%,100%_100%)]")}>
        <div className="float-left w-full aspect-square [shape-outside:polygon(100%_0,100%_0,14.5%_100%,0_100%,0_0)]"></div>
        <div className="text-end ml-auto">
          <p className="font-semibold text-3xl font-baskervville">Gabriel Leão</p>
          <p className="text-[.75rem] md:text-base">Meu nome é Gabriel Leão, sou um dos fundados de Marques & Leão, tenho 32 anos, morador de Novo Hamburgo, casado com a Nina, que é dona do meu coração e pai de pet do meu cachorrinho chamado Véio, atuo no mercado imobiliário há quase 11 anos, profissão onde me encontrei e sou apaixonado pelo que faço!</p>
        </div>
      </div>
    </>
  )
}

export default MarquesAndLeaoImg