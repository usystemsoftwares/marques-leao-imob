"use client"

import { corretores } from "@/data"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

type BaskervvilleProps = {
  baskervville: string;
}

const EstateAgents = ({ baskervville }: BaskervvilleProps) => {
  const [currentEstateAgent, setCurrentEstateAgent] = useState<number>(0)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    container: ref
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"])

  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-between mt-10 lg:gap-8">
      <div className="flex flex-col items-center lg:block">
        <div className="flex justify-evenly w-full lg:w-auto sm:gap-8 items-center lg:block">
          <Image
            className="max-w-[45%] lg:max-w-full rounded-[.625rem] border-[.313rem] border-mainPurple"
            src={corretores[currentEstateAgent].image}
            width={370}
            height={452}
            alt={corretores[currentEstateAgent].name}
          />
          <div className="lg:hidden mt-7 gap-8">
            <p>
              <span className="text-3xl block font-bold">+{corretores[currentEstateAgent].imoveis}</span> imóveis <br /> em carteira
            </p>
            <p className="mt-4">
              <span className="text-3xl block font-bold">+{corretores[currentEstateAgent].experiencia}</span> anos de <br /> experiência
            </p>
          </div>
        </div>
        <div className="my-3 lg:my-0">
          <h3 className={`text-6xl my-3 ${baskervville}`}>{corretores[currentEstateAgent].name}</h3>
          <p className={`text-xl max-w-[43ch]`}>{corretores[currentEstateAgent].text}</p>
        </div>
        <div className="hidden lg:flex lg:items-center lg:mt-7 lg:gap-8">
          <p>
            <span className="text-3xl block font-bold">+{corretores[currentEstateAgent].imoveis}</span> imóveis <br /> em carteira
          </p>
          <p>
            <span className="text-3xl block font-bold">+{corretores[currentEstateAgent].experiencia}</span> anos de <br /> experiência
          </p>
          <Link
            className="hidden lg:inline-block bg-mainPurple hover:bg-white hover:text-black ml-5 text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href={""}>Conhecer {corretores[currentEstateAgent].name}</Link>
        </div>
        <Link
          className="inline-block mb-5 lg:mb-0 lg:hidden bg-mainPurple hover:bg-white hover:text-black ml-5 text-center transition-colors text-sm py-3 px-12 rounded-lg"
          href={""}>Conhecer {corretores[currentEstateAgent].name}</Link>
      </div>
      <div className="flex justify-center lg:justify-normal">
        <motion.div className="bg-[#3E3E3E] relative w-1 lg:h-full mr-4">
          <motion.div
            className="absolute bg-white w-full h-[40%] origin-top"
            style={{ y }}
          >
          </motion.div>
        </motion.div>
        <ul
          className="grid grid-cols-3 overflow-y-scroll max-h-[28.125rem] md:max-h-[47.875rem] lg:px-7 no-scrollbar"
          ref={ref}
        >
          {corretores.map((corretor, index: number) => (
            <li
              key={corretor.id}
              onClick={() => setCurrentEstateAgent(index)}
              className={cn("cursor-pointer rounded-[.625rem]", index === currentEstateAgent ? "border-[.313rem] border-mainPurple" : "")}
            >
              <Image
                className="rounded-[.625rem] w-full h-full"
                width={202}
                height={244}
                src={corretor.image}
                alt={corretor.name}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EstateAgents