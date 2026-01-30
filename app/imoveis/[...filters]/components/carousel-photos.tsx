"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Foto } from "smart-imob-types";
// CDN disabled - function returns URL unchanged

export default function CarouselPhotos({
  images,
  logo,
}: {
  images: Foto[];
  logo?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const visibleThumbs = 5;
  const thumbWidth = 96; // Largura aproximada de cada miniatura
  const thumbGap = 8; // Espaço entre as miniaturas
  const totalThumbWidth = thumbWidth + thumbGap;

  // Funções memoizadas com useCallback
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const selectSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // Listener de teclado para navegação com setas e tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, isFullscreen]);

  // Controle de rolagem do body para fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFullscreen]);

  // Cálculo do índice inicial das miniaturas
  const startThumbIndex = useMemo(() => {
    const half = Math.floor(visibleThumbs / 2);
    let start = currentIndex - half;
    if (start < 0) start = 0;
    if (start > images.length - visibleThumbs)
      start = Math.max(images.length - visibleThumbs, 0);
    return start;
  }, [currentIndex, images.length, visibleThumbs]);

  // Imagens visíveis nas miniaturas
  const visibleImages = useMemo(() => {
    return images.slice(startThumbIndex, startThumbIndex + visibleThumbs);
  }, [images, startThumbIndex, visibleThumbs]);

  // Deslocamento do slider de miniaturas
  const thumbsTranslate = useMemo(() => {
    return -(startThumbIndex * totalThumbWidth);
  }, [startThumbIndex, totalThumbWidth]);

  const ThumbCarousel = (
    <div className="mt-4 flex justify-center items-center relative">
      <div
        className="relative overflow-hidden no-scrollbar"
        style={{ width: visibleThumbs * totalThumbWidth - thumbGap }}
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(${thumbsTranslate}px)`,
          }}
        >
          {images.map(({ resized, source }, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 cursor-pointer border-2 transition-all ${
                currentIndex === index ? "border-white" : "border-transparent"
              }`}
              style={{
                width: thumbWidth,
                height: 64,
                marginRight: thumbGap,
              }}
              onClick={() => selectSlide(index)}
            >
              <Image
                src={source.uri || "/default-image.jpg"}
                alt={`Miniatura ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority
                quality={100}
              />
              {logo && (
                <div className="absolute bottom-2 right-5 z-50">
                  <Image
                    src={logo || ""}
                    alt="Logo da empresa"
                    width={50}
                    height={25}
                    className="opacity-80"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modal Fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-[999999999]">
          <div
            {...handlers}
            className="relative w-full h-full bg-black flex justify-center items-center"
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
                      src={source.uri || "/default-image.jpg"}
                      alt={`Imóvel ${index + 1}`}
                      priority
                      fill
                      style={{ objectFit: "contain" }}
                      quality={100}
                    />
                    {logo && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                        <Image
                          src={logo}
                          alt="Logo da empresa"
                          width={150}
                          height={75}
                          className="opacity-80"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

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

              <button
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-md shadow-md hover:bg-opacity-90 transition text-sm text-white"
                onClick={toggleFullscreen}
                aria-label="Sair da Tela Cheia"
              >
                Clique ou aperte ESC para sair
              </button>
            </div>
          </div>
          {ThumbCarousel}
        </div>
      )}

      {!isFullscreen && (
        <div className="flex flex-col items-center">
          <div
            {...handlers}
            className="relative w-full mx-auto overflow-hidden"
            style={{
              width: "70rem",
              height: "40rem",
              maxWidth: "70rem",
              maxHeight: "40rem",
              transition: "width 0.3s, height 0.3s",
            }}
          >
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[40rem]">
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
                      src={source.uri || "/default-image.jpg"}
                      alt={`Imóvel ${index + 1}`}
                      priority
                      fill
                      style={{ objectFit: "contain" }}
                      quality={100}
                    />
                    {logo && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                        <Image
                          src={logo || ""}
                          alt="Logo da empresa"
                          width={150}
                          height={75}
                          className="opacity-80"
                        />
                      </div>
                    )}
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

              <div
                onClick={toggleFullscreen}
                className="hover:bg-opacity-70 transition cursor-pointer absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md text-sm"
              >
                Clique para Expandir
              </div>
            </div>
          </div>
          {ThumbCarousel}
        </div>
      )}
    </>
  );
}
