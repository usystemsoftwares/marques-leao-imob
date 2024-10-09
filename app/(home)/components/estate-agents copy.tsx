"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Corretor } from "smart-imob-types";

const EstateAgents = ({ corretores = [] }: { corretores: Corretor[] }) => {
  const [currentEstateAgent, setCurrentEstateAgent] = useState<number>(0);

  const listRef = useRef<HTMLUListElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [progressBarHeight, setProgressBarHeight] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  const onScroll = () => {
    if (!listRef.current || !progressBarRef.current) return;

    const scrollTop = listRef.current.scrollTop;
    const scrollHeight = listRef.current.scrollHeight - listRef.current.clientHeight;

    const scrollRatio = scrollTop / scrollHeight;

    const maxY = progressBarRef.current.clientHeight - progressBarHeight;

    setY(scrollRatio * maxY);
  };

  useEffect(() => {
    if (!listRef.current || !progressBarRef.current) return;

    const updateSizes = () => {
      if (!listRef.current || !progressBarRef.current) return;

      const listHeight = listRef.current.clientHeight;
      const contentHeight = listRef.current.scrollHeight;
      const ratio = listHeight / contentHeight;

      const barHeight = ratio * progressBarRef.current.clientHeight;
      setProgressBarHeight(barHeight);
    };

    updateSizes();
    onScroll();

    listRef.current.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateSizes);

    return () => {
      if (listRef.current) listRef.current.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateSizes);
    };
  }, []);
  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-between mt-10 lg:gap-8">
      <div className="flex flex-col lg:w-[80%] lg:block">
        <div className="flex justify-between w-[80%] sm:w-[60%] mx-auto lg:mx-0 lg:w-auto sm:gap-8 items-center lg:block">
          <Image
            className="max-w-[60%] lg:max-w-full rounded-[.625rem] border-[.313rem] border-mainPurple object-cover"
            src={corretores[currentEstateAgent]?.foto || ''}
            width={370}
            height={452}
            alt={corretores[currentEstateAgent]?.nome}
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
          <div className="lg:hidden mt-7 gap-8">
            <p>
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent]?.qtdImoveis}
              </span>{" "}
              imóveis <br /> em carteira
            </p>
            <p className="mt-4">
              <span className="text-3xl block font-bold">
                +{corretores[currentEstateAgent]?.anos_de_experiencia}
              </span>{" "}
              anos de <br /> experiência
            </p>
          </div>
        </div>
        <div className="w-[80%] sm:w-[60%] lg:w-full mx-auto my-3 lg:my-0">
          <h3 className={`text-4xl md:text-6xl my-3 font-baskervville`}>
            {corretores[currentEstateAgent]?.nome}
          </h3>
          <p
            className={`text-base leading-[1.25rem] md:leading-7 md:text-xl max-w-[43ch]`}
          >
            {corretores[currentEstateAgent]?.bio}
          </p>
          <Link
            className="inline-block w-fit mb-5 lg:mb-0 lg:hidden bg-mainPurple hover:bg-white hover:text-black mt-3 md:text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href=""
          >
            Conhecer {corretores[currentEstateAgent]?.nome}
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center lg:mt-7 lg:gap-8">
          <p>
            <span className="text-3xl block font-bold">
              +{corretores[currentEstateAgent]?.qtdImoveis}
            </span>{" "}
            imóveis <br /> em carteira
          </p>
          <p>
            <span className="text-3xl block font-bold">
              +{corretores[currentEstateAgent]?.anos_de_experiencia}
            </span>{" "}
            anos de <br /> experiência
          </p>
          <Link
            className="hidden lg:inline-block self-start bg-mainPurple hover:bg-white hover:text-black ml-5 text-center transition-colors text-sm py-3 px-12 rounded-lg"
            href={`/equipe/${corretores[currentEstateAgent]?.db_id}`}
          >
            Conhecer {corretores[currentEstateAgent]?.nome}
          </Link>
        </div>
      </div>
      <div className="flex justify-center lg:w-full lg:justify-normal">
        <div className="bg-[#3E3E3E] relative w-1 lg:h-full mr-4" ref={progressBarRef}>
          <motion.div
            className="absolute bg-white w-full origin-top"
            style={{ height: progressBarHeight, y }}
          ></motion.div>
        </div>
        <ul
          className="grid grid-cols-3 lg:w-full overflow-y-scroll max-h-[28.125rem] md:max-h-[47.875rem] lg:px-7 no-scrollbar"
          ref={listRef}
        >
          {corretores.map((corretor, index: number) => (
            <li
              key={corretor.db_id}
              onClick={() => setCurrentEstateAgent(index)}
              className={cn(
                "cursor-pointer rounded-[.625rem]",
                index === currentEstateAgent
                  ? "border-[.313rem] border-mainPurple"
                  : ""
              )}
            >
              <Image
                className="rounded-[.625rem] object-cover"
                width={202}
                height={244}
                src={corretor.foto || ""}
                alt={corretor.nome}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EstateAgents;
