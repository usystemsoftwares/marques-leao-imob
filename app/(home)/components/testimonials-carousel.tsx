"use client";

import UseEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Depoimento } from "smart-imob-types";
import { motion } from "framer-motion";
import Image from "next/image";
import Stars from "/public/marqueseleao/stars.svg";

const TestimonialsCarousel = ({
  depoimentos,
}: {
  depoimentos: Depoimento[];
}) => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ dragFree: true });
  const desktopBarRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);

  const [progressBarWidthDesktop, setProgressBarWidthDesktop] = useState<number>(0);
  const [progressBarWidthMobile, setProgressBarWidthMobile] = useState<number>(0);
  const [xDesktop, setXDesktop] = useState<number>(0);
  const [xMobile, setXMobile] = useState<number>(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();

    if (desktopBarRef.current) {
      const maxXDesktop = desktopBarRef.current.clientWidth - progressBarWidthDesktop;
      setXDesktop(scrollProgress * maxXDesktop);
    }

    if (mobileBarRef.current) {
      const maxXMobile = mobileBarRef.current.clientWidth - progressBarWidthMobile;
      setXMobile(scrollProgress * maxXMobile);
    }
  }, [emblaApi, progressBarWidthDesktop, progressBarWidthMobile]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSizes = () => {
      if (!emblaApi) return;
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const contentWidth = emblaApi.containerNode().scrollWidth;
      const scrollRatio = viewportWidth / contentWidth;

      if (desktopBarRef.current) {
        const parentWidth = desktopBarRef.current.clientWidth;
        const barWidth = scrollRatio * parentWidth;
        setProgressBarWidthDesktop(barWidth);
      }

      if (mobileBarRef.current) {
        const parentWidth = mobileBarRef.current.clientWidth;
        const barWidth = scrollRatio * parentWidth;
        setProgressBarWidthMobile(barWidth);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSizes();
      onScroll();
    });

    resizeObserver.observe(emblaApi.rootNode());
    resizeObserver.observe(emblaApi.containerNode());
    if (desktopBarRef.current) resizeObserver.observe(desktopBarRef.current);
    if (mobileBarRef.current) resizeObserver.observe(mobileBarRef.current);

    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", () => {
      updateSizes();
      onScroll();
    });

    updateSizes();
    onScroll();

    return () => {
      resizeObserver.disconnect();
    };
  }, [emblaApi, onScroll]);

  if (!depoimentos || depoimentos.length === 0) return null;

  return (
    <div>
      <div className="flex w-[min(90%,68rem)] mx-auto">
        <div>
          <span className="text-[#898989] flex gap-4 items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">
            Depoimentos
          </span>
          <h2 className={`text-3xl font-baskervville`}>
            Veja alguns comentários dos nossos clientes
          </h2>
        </div>
        <div
          className="hidden md:block bg-[#3E3E3E] relative mt-auto mb-2 w-full h-[3px]"
          ref={desktopBarRef}
        >
          <motion.div
            className="absolute bg-white h-full origin-left"
            style={{ width: progressBarWidthDesktop, x: xDesktop }}
          ></motion.div>
        </div>
      </div>
      <div className="embla w-[min(100%,calc((13.825rem+1.5rem)*4))] overflow-x-hidden mt-8">
        <div className="embla__viewport" ref={emblaRef}>
          <ul className="embla__container ml-4 gap-6">
            {depoimentos.map((depoimento) => (
              <li
                className="rounded-[1.25rem] flex-shrink-0 flex-grow-0 bg-white px-6 pt-6 pb-4 text-black text-center font-semibold w-[min(100%,13.825rem)] overflow-hidden"
                key={depoimento.id}
              >
                <blockquote className="w-full h-full max-w-[20ch]">
                  <Image
                    className="mx-auto mb-4"
                    width={58}
                    height={58}
                    src={depoimento.foto}
                    alt="Foto de perfil"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <p className="leading-5">{depoimento.texto}</p>
                  <Image
                    className="mx-auto my-3"
                    src={Stars}
                    alt="Estrelas"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                  <p className="text-[#707070]">{depoimento.nome}</p>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="block w-[min(90%,68rem)] mx-auto md:hidden bg-[#3E3E3E] relative mt-12 h-[3px]"
        ref={mobileBarRef}
      >
        <motion.div
          className="absolute bg-white h-full origin-left"
          style={{ width: progressBarWidthMobile, x: xMobile }}
        ></motion.div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
