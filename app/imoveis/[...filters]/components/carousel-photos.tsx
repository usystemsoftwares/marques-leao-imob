"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Foto } from "smart-imob-types";

export default function CarouselPhotos({ images }: { images: Foto[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: true,
  });

  return (
    <>
      <div
        {...handlers}
        className="relative w-full mx-auto overflow-hidden"
        style={{ maxWidth: "80rem" }}
      >
        <div className="relative">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map(({ resized, source }, index) => (
              <div
                key={index}
                className="rounded-[.625rem] flex-shrink-0 w-full"
              >
                <Image
                  onClick={toggleFullscreen}
                  className="rounded-[.625rem] cursor-pointer object-contain w-full h-auto"
                  src={source.uri || resized || ""}
                  alt={`Imóvel ${index + 1}`}
                  priority
                  width={1200}
                  height={1200}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>
            ))}
          </div>

          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <IoIosArrowBack size={24} />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
