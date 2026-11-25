"use client";

import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Vídeo de fundo da hero, só no desktop.
 * Renderiza apenas no cliente e só quando a tela é >= md, para o celular
 * não baixar o arquivo.
 */
export default function HeroVideoDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => {
      setIsDesktop(desktop.matches);
      setReduceMotion(motion.matches);
    };
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src="/marqueseleao/hero-desktop.mp4"
        poster="/marqueseleao/hero-desktop-poster.webp"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload={reduceMotion ? "none" : "auto"}
      />
      {/* Escurece o lado do texto para manter a leitura */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      {/* Funde a base do vídeo com o fundo da página */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#141414]" />
    </div>
  );
}
