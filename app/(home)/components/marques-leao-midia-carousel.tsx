"use client";

import UseEmblaCarousel from "embla-carousel-react";
import { midia } from "@/data";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import ArrowLeft from "/public/marqueseleao/arrow-left.webp";
import ArrowRight from "/public/marqueseleao/arrow-right.webp";
import { Post } from "smart-imob-types";

const MarquesLeaoMidiaCarousel = ({ posts }: { posts: Post[] }) => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (posts && (posts || []).filter((post) => post.banner).length === 0) {
    return null;
  }

  return (
    <div className="embla overflow-x-hidden mt-10">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {posts
            .filter((post) => post.banner)
            .map((post) => (
              <div
                className="flex-shrink-0 w-full flex-grow-0 flex md:gap-4 xl:gap-14 md:px-8 flex-col md:flex-row items-center"
                key={post.id}
              >
                <div>
                  <Image
                    className="mx-auto w-[75%] md:w-auto md:mx-0"
                    src={post.banner || ""}
                    alt={post.titulo || ""}
                    width={400}
                    height={532}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                    priority
                    quality={100}
                  />
                </div>
                <div className="max-w-[100ch] mx-auto mt-8 md:mt-0">
                  <h3 className="max-w-[17ch] md:max-w-[25ch] text-2xl md:text-3xl font-bold tracking-wider md:tracking-widest">
                    {post.titulo}
                  </h3>
                  <p className="max-w-[28ch] text-lg md:text-xl my-4 tracking-wide md:tracking-wider">
                    {post.conteudo}
                  </p>
                  <Link
                    className="bg-mainPurple inline-block hover:bg-white hover:text-black transition-colors text-xl w-[min(100%,15.625rem)] text-center py-3 px-5 rounded-lg"
                    href={`/blogs/${post.id}`}
                  >
                    Ver matéria
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
      <button
        className="embla__prev absolute top-1/2 translate-y-1/2 left-0"
        onClick={scrollPrev}
      >
        <Image
          src={ArrowLeft}
          alt="Seta para esquerda"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </button>
      <button
        className="embla__next absolute top-1/2 translate-y-1/2 right-0"
        onClick={scrollNext}
      >
        <Image
          src={ArrowRight}
          alt="Seta para direita"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </button>
    </div>
  );
};

export default MarquesLeaoMidiaCarousel;
