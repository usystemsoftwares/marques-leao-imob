"use client";

import Image from "next/image";
import Link from "next/link";
import Bed from "/public/marqueseleao/cama.svg";
import ResizeIcon from "/public/marqueseleao/resize-icon.svg";
import HeartIcon from "/public/marqueseleao/heart-icon.svg";
import SelectedHeartIcon from "/public/marqueseleao/selected-heart-icon.svg";
import { useState } from "react";
import { toBRL } from "@/utils/toBrl";
import { getSingleArea } from "@/utils/get-area";
import { getFotoDestaque } from "@/utils/get-foto-destaque";
import { Imóvel } from "smart-imob-types";

type EstateDetailsProps = {
  estate: Imóvel;
};

const EstateDetails = ({ estate }: EstateDetailsProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div
      className={
        "group flex-shrink-0 flex-grow-0 w-[min(100%,27.813rem)] relative"
      }
    >
      <div className="embla__slide__number pt-5">
        <div className="relative">
        <div className="absolute top-7 left-2 bg-white bg-opacity-70 text-black px-3 py-1 rounded-md z-[99]">
            {estate.codigo}
          </div>
          <button
            className="block absolute right-[5%] top-[7.5%]"
            onClick={toggleFavorite}
          >
            <Image
              className="w-8"
              src={isFavorited ? SelectedHeartIcon : HeartIcon}
              alt={
                isFavorited
                  ? "Ícone de coração selecionado"
                  : "Ícone de coração"
              }
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </button>
          <Link className="block" href={`/imoveis/${estate.db_id}`}>
            <Image
              className="w-full rounded-lg h-[375px] w-[538px] relative"
              src={getFotoDestaque(estate) || ""}
              alt={estate.titulo || "Detalhes do Imóvel"}
              width={538}
              height={375}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Link>
        </div>
        <Link
          href={`/imoveis/${estate.db_id}`}
          className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity"
        >
          {estate.preço_venda &&
          (estate.venda_exibir_valor_no_site === undefined ||
            estate.venda_exibir_valor_no_site === true) ? (
            <p className="font-semibold text-sm lg:text-base">
              {toBRL(estate.preço_venda)}
            </p>
          ) : (
            <p className="font-semibold text-sm lg:text-base">Consulte-nos</p>
          )}

          <p className="text-[.75rem]">
            {estate.bairro ? `${estate.bairro} /` : ""} {estate.cidade?.nome}
          </p>
        </Link>
        <Link
          href={`/imoveis/${estate.db_id}`}
          className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2"
        >
          <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
            <span className="inline-flex gap-3 items-center">
              <Image
                src={ResizeIcon}
                alt="Área do Imóvel"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              {getSingleArea(estate)}
            </span>
            {estate.dormitórios && !estate.não_mostrar_dormítorios && (
              <span className="inline-flex gap-3 items-center">
                <Image
                  src={Bed}
                  alt="Dormitórios"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />{" "}
                {estate.dormitórios} quarto
                {`${Number(estate.dormitórios || 0) > 1 ? "s" : ""}`}
              </span>
            )}
          </div>
          <div className="w-[35%] flex items-center lg:block text-center bg-mainPurple px-3">
            Conhecer
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EstateDetails;
