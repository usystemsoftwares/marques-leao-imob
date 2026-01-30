"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// CDN disabled - function returns URL unchanged
const getCdnUrl = (url: string | undefined | null): string => url || "";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Corretor } from "smart-imob-types";

const EstateAgents = ({ corretores }: { corretores: Corretor[] }) => {
  const [currentEstateAgent, setCurrentEstateAgent] = useState<number>(0);
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
  });

  const handleToggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-between mt-10 lg:gap-8">
      <div className="flex flex-col lg:w-[80%] lg:block">
        <div className="flex flex-col items-center w-[80%] sm:w-[60%] mx-auto lg:mx-0 lg:w-auto lg:block">
          <Image
            className="w-[320px] sm:w-[370px] h-[450px] sm:h-[452px] lg:max-w-full rounded-[0.625rem] border-[0.313rem] border-mainPurple object-cover"
            src={getCdnUrl(corretores[currentEstateAgent].foto) || ""}
            width={370}
            height={452}
            alt={corretores[currentEstateAgent].nome}
          />

          {/* INFOS ABAIXO DA IMAGEM - MOBILE */}
          <div className="lg:hidden mt-6 flex flex-row justify-center gap-12 text-center">
            {corretores[currentEstateAgent].qtdImoveis > 0 && (
              <p>
                <span className="text-3xl block font-bold">
                  +{corretores[currentEstateAgent].qtdImoveis}
                </span>
                imóveis <br /> em carteira
              </p>
            )}

            {Number(corretores[currentEstateAgent].anos_de_experiencia || 0) > 0 && (
              <p>
                <span className="text-3xl block font-bold">
                  +{corretores[currentEstateAgent].anos_de_experiencia}
                </span>
                anos de <br /> experiência
              </p>
            )}
          </div>
        </div>

        <div className="w-[80%] sm:w-[60%] lg:w-full mx-auto my-3 lg:my-0">
          <h3 className={`text-4xl md:text-6xl my-3 font-baskervville`}>
            {corretores[currentEstateAgent].nome}
          </h3>
          {corretores[currentEstateAgent].cargo && (
            <p
              className={`text-base leading-[1.25rem] md:leading-7 md:text-xl max-w-[43ch]`}
            >
              {corretores[currentEstateAgent].cargo}
            </p>
          )}
          {corretores[currentEstateAgent] &&
            corretores[currentEstateAgent].bio && (
              <p
                className={`text-base leading-[1.25rem] md:leading-7 md:text-xl max-w-[43ch] mt-4`}
              >
                {isBioExpanded
                  ? corretores[currentEstateAgent].bio
                  : (corretores[currentEstateAgent].bio || "").length > 110
                  ? `${(corretores[currentEstateAgent].bio || "").substring(
                      0,
                      110
                    )}... `
                  : corretores[currentEstateAgent].bio || ""}
              </p>
            )}

          <Link
            className="
    inline-block 
    w-full sm:w-fit 
    mb-5 lg:mb-0 lg:hidden 
    bg-mainPurple 
    hover:bg-white 
    hover:text-black 
    mt-4 
    text-lg sm:text-sm 
    py-4 sm:py-3 
    px-16 sm:px-12 
    rounded-lg 
    transition-colors 
    text-center
  "
            href={`/equipe/${corretores[currentEstateAgent].db_id}`}
          >
            Conhecer {corretores[currentEstateAgent].nome}
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:mt-7 lg:gap-8">
          {corretores[currentEstateAgent].qtdImoveis > 0 && (
            <p>
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent].qtdImoveis}
              </span>{" "}
              imóveis <br /> em carteira
            </p>
          )}
          {Number(corretores[currentEstateAgent].anos_de_experiencia || 0) >
            0 && (
            <p>
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent].anos_de_experiencia}
              </span>{" "}
              anos de <br /> experiência
            </p>
          )}

          <Link
            className="hidden lg:inline-block self-start bg-mainPurple hover:bg-white hover:text-black ml-5 text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href={`/equipe/${corretores[currentEstateAgent].db_id}`}
          >
            Conhecer {corretores[currentEstateAgent].nome}
          </Link>
        </div>
      </div>
      <div className="flex justify-center lg:w-full lg:justify-normal">
        <motion.div className="bg-[#3E3E3E] relative w-1 lg:h-full mr-4">
          <motion.div
            className="absolute bg-white w-full h-[40%] origin-top"
            style={{ y }}
          ></motion.div>
        </motion.div>
        <ul
          className="grid grid-cols-3 lg:w-full overflow-y-scroll max-h-[28.125rem] md:max-h-[47.875rem] lg:px-7 no-scrollbar"
          ref={ref}
        >
          {corretores.map((corretor, index: number) => (
            <li
              key={corretor.db_id}
              onClick={() => {
                setCurrentEstateAgent(index);
                setIsBioExpanded(false);
              }}
              className={cn(
                "cursor-pointer rounded-[.625rem]",
                index === currentEstateAgent
                  ? "border-[.313rem] border-mainPurple"
                  : ""
              )}
            >
              <Image
                className="rounded-[.625rem] w-full h-full"
                width={202}
                height={244}
                src={getCdnUrl(corretor.foto) || ""}
                alt={corretor.nome}
                style={{
                  maxWidth: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                priority={true}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EstateAgents;
