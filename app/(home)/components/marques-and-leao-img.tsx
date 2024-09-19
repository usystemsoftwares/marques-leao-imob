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
      <div className={cn("hidden pl-5 pt-5 bg-white/70 text-black absolute left-0 top-0 w-1/2", showPablo && "block")}>
        <div>
          <p className="font-semibold text-3xl font-baskervville">Pablo Marques</p>
          <p className="">Atuando a mais de 12 anos no mercado imobiliário, tive o privilégio de impactar dezenas de pessoas ao longo da minha trajetório, o que me trouxe expertise quando o assunto é imóveis e transformação de vidas. Com foco em imóveis de médio e alto padrão na região de Novo Hamburgo e Campo Bom, sou especialista em ativos imobiliários e estratégias de marketing imobiliário.</p>
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
      <div className={cn("hidden pr-5 pb-5 absolute bg-mainPurple/70 right-0 bottom-0 w-1/2", showGabriel && "block")}>
        <div>
          <p className="font-semibold text-3xl font-baskervville">Gabriel Leão</p>
          <p className="">Meu nome é Gabriel Leão, sou um dos fundados de Marques & Leão, tenho 32 anos, morador de Novo Hamburgo, casado com a Nina, que é dona do meu coração e pai de pet do meu cachorrinho chamado Véio, atuo no mercado imobiliário há quase 11 anos, profissão onde me encontrei e sou apaixado pelo que faço!</p>
        </div>
      </div>
    </>
  )
}

export default MarquesAndLeaoImg