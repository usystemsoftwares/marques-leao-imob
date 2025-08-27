"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HandshakeIcon from "/public/marqueseleao/handshake-icon.svg";
import WhatsappPurpleIcon from "/public/marqueseleao/whatsapp-purple-icon.svg";
import WhiteSearchIcon from "/public/marqueseleao/white-search-icon.svg";

export const ResponsivityButtons = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    // Verifica se o código está sendo executado no lado do cliente
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Limpeza para remover o listener quando o componente desmontar
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if (windowWidth === null) {
    // Retorna nulo ou um componente de carregamento enquanto o tamanho da janela não é detectado
    return null;
  }

  // Verifica se a largura da tela está entre 1110px e 770px
  const hideText = windowWidth <= 1110 && windowWidth >= 770;

  return (
    <ul
      key={windowWidth} // Chave para forçar o re-render com base na largura da tela
      className="grid md:grid-cols-3 *:min-w-fit md:*:min-w-0 md:*:w-[min(100%,12.5rem)] md:*:h-full md:*:aspect-square *:inline-flex md:*:flex-col *:items-center md:*:items-start md:*:justify-between *:gap-2 sm:gap-4 md*:gap-0 *:font-bold md:*:font-medium xl:*:font-bold text-[.813rem] md:text-[clamp(.75rem,1.75vw,1rem)] lg:*:text-lg *:rounded-[.625rem] *:px-2 sm:px-4 md:*:px-1 lg:*:px-4 *:py-2 md:*:py-2 lg:*:py-8 gap-2 sm:gap-x-3 gap-y-3 marques_leao"
    >
      <li className="bg-mainPurple *:min-w-fit md:*:w-[min(100%,12.5rem)] md:*:h-full md:*:aspect-square *:inline-flex md:*:flex-col *:items-center md:*:items-start md:*:justify-between *:gap-4 md*:gap-0 *:font-medium xl:*:font-bold *:rounded-[.625rem] !px-4 md:!px-1 lg:!px-2 xl:!px-4">
        <Link
          className="!py-0 md:!py-0 lg:!py-0 !px-0 !text-[.9375rem] md:!text-[clamp(.75rem,1.75vw,1rem)] lg:!text-base xl:!text-lg"
          href="/anunciar-imovel"
        >
          <div className={`${hideText ? "" : "w-5 lg:w-auto"}`}>
            <Image
              src={WhiteSearchIcon}
              alt="Ícone de pesquisa"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          {!hideText && (
            <p className="xl:leading-[1.5rem]">Anuncie seu imóvel conosco</p>
          )}
        </Link>
      </li>
      <li className="bg-white text-mainPurple">
        <Link
          className={`${
            hideText ? "w-8 h-8 lg:w-12 lg:h-12" : "w-5 lg:w-auto"
          }`}
          href={"/equipe"}
        >
          <Image
            src={WhatsappPurpleIcon}
            alt="Whatsapp"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
        {!hideText && (
          <Link href={"/equipe"}>
            <p className="max-w-[15ch] leading-[1rem] lg:leading-[1.5rem] md:max-w-auto">
              Fale com nossos corretores
            </p>
          </Link>
        )}
      </li>
      <li className="bg-white text-mainPurple">
        <Link
          className={`${
            hideText ? "w-8 h-8 lg:w-12 lg:h-12" : "w-5 lg:w-auto"
          }`}
          target="_blank"
          href={
            "https://s.tintim.app/whatsapp/a9760b6e-fc26-4493-b2e3-7ff652429152/95b5bf55-8193-4994-adb1-92d308cc6b49"
          }
        >
          <Image
            src={HandshakeIcon}
            alt="Ícones de aperto de mãos"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
        {!hideText && (
          <Link
            target="_blank"
            href={
              "https://s.tintim.app/whatsapp/a9760b6e-fc26-4493-b2e3-7ff652429152/95b5bf55-8193-4994-adb1-92d308cc6b49"
            }
          >
            <p className="max-w-[15ch] leading-[1rem] lg:leading-[1.5rem] md:max-w-auto">
              Seja parceiro Marques&Leão
            </p>
          </Link>
        )}
      </li>
    </ul>
  );
};
