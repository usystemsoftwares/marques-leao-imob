"use client"

import Image from "next/image"
import PabloEGabriel from "/public/marqueseleao/foto-pablo-e-gabriel.webp"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const sideVariants = {
  closed: {
    display: "none",
    opacity: 0
  },
  open: {
    display: "block",
    opacity: 1
  }
}

const textVariants = {
  closed: {
    opacity: 0,
    y: 50
  },
  open: {
    opacity: 1,
    y: 0
  }
}

const MarquesAndLeaoImg = () => {
  const [showPablo, setShowPablo] = useState(false)
  const [showGabriel, setShowGabriel] = useState(false)

  return <>
    <button
      onClick={() => setShowPablo(!showPablo)}
      className={cn("absolute font-bold top-[2%] left-[8%] bg-black/45 z-10 border border-transparent px-5 py-2 rounded-[100vmax] lg:rounded-xl", showPablo && "bg-transparent border-black text-black")}
    >Conhecer Pablo</button>
    <motion.div
      className="bg-white/80 text-black absolute left-0 top-0 w-full h-full [clip-path:polygon(100%_0,100%_0,15%_100%,0_100%,0_0)]"
      initial={false}
      animate={showPablo ? "open" : "closed"}
      variants={sideVariants}
    >
      <div className="float-right w-full h-full [shape-outside:polygon(100%_0,17%_100%,100%_100%)]"></div>
      <div className="ml-3 sm:ml-10 lg:ml-[8%] mt-[15%] sm:mt-[20%] lg:mt-[12.5%] font-medium max-w-[32.5ch]">
        <motion.p
          className="font-bold text-3xl sm:text-5xl md:text-5xl lg:text-4xl xl:text-5xl font-baskervville"
          initial={false}
          transition={{ bounce: false, duration: .2 }}
          animate={showPablo ? "open" : "closed"}
          variants={textVariants}
        >Pablo Marques</motion.p>
        <p className="mt-2 text-[clamp(.75rem,3vw,1rem)] sm:text-lg lg:text-base xl:text-lg !leading-[1.3]">Com 14 anos de experiência no mercado imobiliário, tive o privilégio de impactar muitas vidas. Especialista em imóveis de alto padrão em Novo Hamburgo, Campo Bom, Estância Velha e em investimentos no litoral de Santa Catarina, combino expertise em ativos imobiliários e marketing estratégico. Minha missão é conectar pessoas a imóveis que expressem seus valores, sempre proporcionando uma experiência transformadora.</p>
      </div>
    </motion.div>
    <Image
      className="rounded-[.625rem]"
      src={PabloEGabriel}
      alt="Pablo Marques e Gabriel Leão"
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
    <button
      onClick={() => setShowGabriel(!showGabriel)}
      className={cn("absolute bottom-[2%] font-bold right-[3%] bg-black/45 z-10 px-5 border border-transparent transition-colors py-2 rounded-[100vmax] lg:rounded-xl", showGabriel && "bg-transparent border-white")}
    >Conhecer Gabriel</button>
    <motion.div
      className="absolute bg-mainPurple/80 right-0 bottom-0 w-full h-full [clip-path:polygon(100%_0,14.6%_100%,100%_100%)]"
      initial={false}
      animate={showGabriel ? "open" : "closed"}
      variants={sideVariants}
    >
      <div className="float-left w-full h-full [shape-outside:polygon(100%_0,100%_0,14.5%_100%,0_100%,0_0)]"></div>
      <div className="text-end font-medium mt-[clamp(30%,32.5vw,100%)] sm:mt-[68%] lg:mt-[50%] xl:mt-[68%] translate-x-[-.5rem]">
        <motion.p
          className="font-semibold text-[clamp(1.125rem,5vw,1.5rem)] sm:text-[2.75rem] lg:text-[2rem] xl:text-[2.75rem] font-baskervville"
          initial={false}
          transition={{ bounce: false, duration: .15 }}
          animate={showGabriel ? "open" : "closed"}
          variants={textVariants}
        >Gabriel Leão</motion.p>
        <p className="mt-2 lg:mt-4 text-[clamp(.75rem,3vw,1rem)] sm:text-lg lg:text-base xl:text-lg !leading-[1.3]">Há quase 13 anos no mercado imobiliário, sou apaixonado pelo que faço! Com uma personalidade sinestésica, adoro conversar, desafios e sou competitivo. Responsável pela gestão de equipe e negociações, já liderei a venda de mais de 1.500 imóveis. Tenho certeza de que podemos alcançar o melhor negócio. Será um prazer te conhecer e fazer parte da sua história!</p>
      </div>
    </motion.div>
  </>;
}

export default MarquesAndLeaoImg