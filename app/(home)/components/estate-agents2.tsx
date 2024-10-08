"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Corretor } from "smart-imob-types";

const EstateAgents = ({ corretores }: { corretores: Corretor[] }) => {
  const [currentEstateAgent, setCurrentEstateAgent] = useState<number>(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const shouldApplyMaxHeight = corretores.length > 6;

  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-between mt-10 lg:gap-8">
      <div className="flex flex-col lg:w-[80%] lg:block">
        <div className="flex justify-between items-center w-[80%] sm:w-[60%] mx-auto lg:mx-0 lg:w-auto sm:gap-8 lg:block">
          <div className="relative max-w-[60%] lg:max-w-full rounded-[.625rem] border-[.313rem] border-mainPurple w-[370px] h-[452px] mx-auto lg:mx-0 overflow-hidden">
            <Image
              className="object-cover"
              layout="fill"
              src={corretores[currentEstateAgent].foto || ""}
              alt={corretores[currentEstateAgent].nome}
            />
          </div>
          <div className="lg:hidden mt-7 gap-8">
            <p>
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent].qtdImoveis}
              </span>{" "}
              imóveis <br /> em carteira
            </p>
            <p className="mt-4">
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent].anos_de_experiencia}
              </span>{" "}
              anos de <br /> experiência
            </p>
          </div>
        </div>
        <div className="w-[80%] sm:w-[60%] lg:w-full mx-auto my-3 lg:my-0">
          <h3 className={`text-4xl md:text-6xl my-3 font-baskervville`}>
            {corretores[currentEstateAgent].nome}
          </h3>
          <p
            className={`text-base leading-[1.25rem] md:leading-7 md:text-xl max-w-[43ch]`}
          >
            {corretores[currentEstateAgent].bio}
          </p>
          <Link
            className="inline-block w-fit mb-5 lg:mb-0 lg:hidden bg-mainPurple hover:bg-white hover:text-black mt-3 md:text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href={`/equipe/${corretores[currentEstateAgent].db_id}`}
          >
            Conhecer {corretores[currentEstateAgent].nome}
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:mt-7 lg:gap-8">
          <p>
            <span className="text-3xl block font-bold">
              +{corretores[currentEstateAgent].qtdImoveis}
            </span>{" "}
            imóveis <br /> em carteira
          </p>
          <p>
            <span className="text-3xl block font-bold">
              +{corretores[currentEstateAgent].anos_de_experiencia}
            </span>{" "}
            anos de <br /> experiência
          </p>
          <Link
            className="hidden lg:inline-block self-start bg-mainPurple hover:bg-white hover:text-black ml-5 text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href={`/equipe/${corretores[currentEstateAgent].db_id}`}
          >
            Conhecer {corretores[currentEstateAgent].nome}
          </Link>
        </div>
      </div>
      <div className="flex justify-center lg:w-full lg:justify-normal">
        {shouldApplyMaxHeight && (
          <motion.div className="bg-[#3E3E3E] relative w-1 lg:h-full mr-4">
            <motion.div
              className="absolute bg-white w-full h-[40%] origin-top"
              style={{ y }}
            ></motion.div>
          </motion.div>
        )}
        <ul
          className={cn(
            "grid grid-cols-3 lg:w-full overflow-y-scroll lg:px-7 no-scrollbar gap-0",
            shouldApplyMaxHeight
              ? "max-h-[28.125rem] md:max-h-[47.875rem]"
              : "max-h-full"
          )}
          ref={ref}
        >
          {corretores.map((corretor, index: number) => (
            <li
              key={corretor.db_id}
              onClick={() => setCurrentEstateAgent(index)}
              className={cn(
                "cursor-pointer rounded-[.625rem] overflow-hidden relative w-full h-[244px]", // Mantém a altura e largura
                index === currentEstateAgent
                  ? "border-[.313rem] border-mainPurple"
                  : ""
              )}
            >
              <div className="relative w-full h-full">
                <Image
                  className="rounded-[.625rem] object-cover"
                  layout="fill"
                  src={corretor.foto || ""}
                  alt={corretor.nome}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EstateAgents;
