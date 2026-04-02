"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type BannerSlide = {
  href: string;
  desktopSrc: StaticImageData;
  mobileSrc: StaticImageData;
  alt: string;
};

export default function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-play every 5s
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg md:rounded-2xl bg-black" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <Link href={slide.href}>
                <Image
                  className="w-full hidden md:block cursor-pointer"
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  style={{ maxWidth: "100%", height: "auto" }}
                  priority={i === 0}
                />
                <Image
                  className="w-full block md:hidden cursor-pointer"
                  src={slide.mobileSrc}
                  alt={slide.alt}
                  style={{ maxWidth: "100%", height: "auto" }}
                  priority={i === 0}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === selectedIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
