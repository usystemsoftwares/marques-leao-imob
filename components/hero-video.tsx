"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DESKTOP_QUERY = "(min-width: 768px)";

const VIDEO = {
  // 1080p, 16:9 — ocupa a hero inteira
  desktop: "/marqueseleao/hero-desktop.mp4",
  // 720x720, recorte central — faixa atrás do logo e do título
  mobile: "/marqueseleao/hero-mobile.mp4",
};

/**
 * Não toca vídeo quando o usuário pediu menos movimento, economia de dados
 * ou está numa conexão lenta. Nesses casos fica só o poster.
 */
function podeTocarVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as any).connection;
  if (conn?.saveData) return false;
  if (["slow-2g", "2g", "3g"].includes(conn?.effectiveType)) return false;
  return true;
}

/**
 * Vídeo de fundo da hero.
 *
 * - Poster é SSR (<picture>): aparece no primeiro paint e cada tela baixa só o seu.
 * - O vídeo só começa a baixar depois que a página abriu (load ou 2,5s), para
 *   não disputar banda com o primeiro paint.
 * - Entra com fade quando o primeiro frame realmente toca. Se o autoplay for
 *   bloqueado (ex.: modo pouco consumo do iPhone), o poster continua e nenhum
 *   botão de play aparece.
 * - Pausa quando a hero sai da tela.
 */
export default function HeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    if (!podeTocarVideo()) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const escolher = () => {
      setTocando(false);
      setSrc(desktop.matches ? VIDEO.desktop : VIDEO.mobile);
    };

    // Começa no `load` da página ou, no máximo, 2,5s depois de montar.
    // A home baixa muitas fotos e o `load` pode demorar minutos no 4G.
    let iniciado = false;
    const iniciar = () => {
      if (iniciado) return;
      iniciado = true;
      escolher();
    };
    const timer = window.setTimeout(
      iniciar,
      document.readyState === "complete" ? 200 : 2500
    );
    window.addEventListener("load", iniciar, { once: true });
    desktop.addEventListener("change", escolher);

    return () => {
      window.removeEventListener("load", iniciar);
      desktop.removeEventListener("change", escolher);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!src || !video || !wrapper) return;

    video.muted = true; // iOS só deixa tocar sozinho se estiver mudo
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="absolute inset-x-0 top-0 h-[24rem] md:h-full -z-10 overflow-hidden pointer-events-none"
    >
      <picture>
        <source
          media={DESKTOP_QUERY}
          srcSet="/marqueseleao/hero-desktop-poster.webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/marqueseleao/hero-mobile-poster.webp"
          alt=""
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>

      {src && (
        <video
          key={src}
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setTocando(true)}
          // LCP: no mobile o vídeo fica 3px mais baixo que o poster (a base está
          // sob o degradê, não aparece), então nunca é maior que ele e não vira
          // o LCP. No desktop ocupa a tela inteira e o Chrome já ignora como fundo.
          className={cn(
            "absolute inset-x-0 top-0 w-full h-[calc(100%-3px)] md:h-full object-cover transition-opacity duration-1000 ease-out",
            tocando ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Escurece para manter a leitura: mobile por igual, desktop do lado do texto */}
      <div className="absolute inset-0 bg-black/50 md:bg-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-black/20" />
      {/* Funde a base do vídeo com o fundo da página */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 md:h-40 bg-gradient-to-b from-transparent to-[#141414]" />
    </div>
  );
}
