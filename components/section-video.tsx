"use client";

import { ResponsivityButtons } from "@/app/(home)/components/responsivity-buttons";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import Media from "/public/marqueseleao/media.webp";

const SectionVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<any>(null);
  const sectionRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying) {
            handlePlay();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      ref={sectionRef}
      className="w-[min(90%,75rem)] mt-24 mb-12 mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-between md:gap-20"
    >
      <div className="relative w-[min(100%,30rem)] ml-4 sm:ml-0">
        {!isPlaying ? (
          <div className="relative w-full h-auto">
            <Image
              className="rounded-xl mx-auto md:mx-0"
              src={Media}
              alt="Gabriel Leão de costas para foto, de frente para uma casa"
              layout="responsive"
              width={300}
              height={200}
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl hover:bg-opacity-70 transition"
              aria-label="Play Video"
            >
              <FaPlay className="text-white text-6xl" />
            </button>
          </div>
        ) : (
          <div className="relative w-full h-auto cursor-pointer">
            <video
              ref={videoRef}
              className="rounded-xl mx-auto md:mx-0 w-full h-auto"
              src="https://firebasestorage.googleapis.com/v0/b/smartimob-dev-test.appspot.com/o/empresas%2F4IYSm7WrQ8naKm28ArY7%2Fvideo-site.mp4?alt=media&token=890a7a4c-5289-4861-baed-412ef30721b2"
              autoPlay
              loop
              muted
              playsInline
              onClick={handleVideoClick}
              width={300}
              height={200}
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        )}

        <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[35%] bottom-[35.5%] sm:bottom-[40%] md:bottom-[60%] px-3 py-3 md:px-2 md:py-2 lg:px-4 lg:py-4 translate-y-[50%] backdrop-blur-2xl rounded-[.625rem]">
          <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block text-center">
            +23mil
          </span>{" "}
          nas redes sociais
        </div>
        <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[50%] bottom-[57%] sm:bottom-[60%] md:bottom-[37.5%] px-3 py-3 md:px-2 md:py-2 lg:px-3 lg:py-3 translate-y-1/2 backdrop-blur-2xl rounded-[.625rem]">
          <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block text-center">
            +1500
          </span>{" "}
          imóveis vendidos
        </div>
        <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[40%] bottom-[78.5%] md:bottom-[15%] px-3 py-3 md:px-2 md:py-2 lg:px-4 lg:py-4 translate-y-1/2 backdrop-blur-2xl rounded-[.625rem]">
          <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block">
            +1 milhão
          </span>{" "}
          de alcance mensal
        </div>
      </div>
      <div className="mt-16 md:mt-0">
        <span className="flex items-center gap-2 text-[#898989] after:inline-block after:w-28 after:h-[1.75px] after:bg-[#898989]">
          Por que
        </span>
        <h2 className={`text-3xl tracking-wide font-baskervville`}>
          Por que a Imobiliária Marques&Leão?
        </h2>
        <p className="mt-3 mb-6 max-w-[40ch] text-[#a7a7a7] leading-5">
          Somos <span className="text-white">a maior vitrine imobiliária</span>{" "}
          da região, investindo em vídeos, anúncios e inovação.
        </p>
        <ResponsivityButtons />
      </div>
    </div>
  );
};

export default SectionVideo;
