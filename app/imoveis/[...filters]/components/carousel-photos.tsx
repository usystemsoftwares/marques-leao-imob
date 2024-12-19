"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Foto } from "smart-imob-types";

export default function CarouselPhotos({ images }: { images: Foto[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    console.log(
      `Current Index: ${currentIndex} -> Previous Index: ${newIndex}`
    );
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    console.log(`Current Index: ${currentIndex} -> Next Index: ${newIndex}`);
    setCurrentIndex(newIndex);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: true,
  });

  // Hook para controlar a rolagem do body
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Limpeza ao desmontar o componente
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFullscreen]);

  return (
    <>
      {/* Estrutura Modal em Tela Cheia */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[999999999]">
          <div
            {...handlers}
            className="relative w-full h-full bg-black"
            style={{ zIndex: 9999999999 }}
          >
            <div className="relative w-full h-full">
              <div
                className="flex transition-transform duration-500 h-full"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {images.map(({ resized, source }, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full h-full flex justify-center items-center bg-black relative"
                  >
                    <Image
                      onClick={toggleFullscreen}
                      className="cursor-pointer"
                      src={source.uri || resized || "/default-image.jpg"}
                      alt={`Imóvel ${index + 1}`}
                      priority
                      fill
                      style={{ objectFit: "contain" }}
                      quality={100}
                    />
                  </div>
                ))}
              </div>

              {/* Botões de Navegação */}
              <button
                className="hover:bg-opacity-70 transition absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full focus:outline-none"
                onClick={prevSlide}
                aria-label="Slide Anterior"
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                className="hover:bg-opacity-70 transition absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full focus:outline-none"
                onClick={nextSlide}
                aria-label="Próximo Slide"
              >
                <IoIosArrowForward size={24} />
              </button>

              {/* Botão para sair do modo fullscreen aprimorado */}
              <button
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-md shadow-md hover:bg-opacity-90 transition text-sm text-white"
                onClick={toggleFullscreen}
                aria-label="Sair da Tela Cheia"
              >
                Sair da Tela Cheia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Normal */}
      {!isFullscreen && (
        <div
          {...handlers}
          className="relative w-full mx-auto overflow-hidden"
          style={{
            width: "80rem",
            height: "46rem",
            maxWidth: "80rem",
            maxHeight: "46rem",
            transition: "width 0.3s, height 0.3s",
          }}
        >
          <div className="relative w-full h-full">
            <div
              className="flex transition-transform duration-500 h-full"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map(({ resized, source }, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-full flex justify-center items-center bg-black relative"
                >
                  <Image
                    onClick={toggleFullscreen}
                    className="cursor-pointer"
                    src={source.uri || resized || "/default-image.jpg"}
                    alt={`Imóvel ${index + 1}`}
                    priority
                    fill
                    style={{ objectFit: "contain" }}
                    quality={100}
                  />
                </div>
              ))}
            </div>

            <button
              className="hover:bg-opacity-70 transition absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full focus:outline-none"
              onClick={prevSlide}
              aria-label="Slide Anterior"
            >
              <IoIosArrowBack size={24} />
            </button>
            <button
              className="hover:bg-opacity-70 transition absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full focus:outline-none"
              onClick={nextSlide}
              aria-label="Próximo Slide"
            >
              <IoIosArrowForward size={24} />
            </button>

            {/* Aviso "Clique para Expandir" */}
            <div onClick={toggleFullscreen} className="hover:bg-opacity-70 transition cursor-pointer absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md text-sm">
              Clique para Expandir
            </div>
          </div>
        </div>
      )}
    </>
  );
}