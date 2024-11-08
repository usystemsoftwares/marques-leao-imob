"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Empresa, Imóvel } from "smart-imob-types";
import FormContact from "./form-contact";
import { getPhotos } from "@/utils/get-photos";

export default function PropertyPhotos({
  empresa,
  imovel,
  afiliado,
  liberado,
  VerFotos,
}: {
  empresa: Empresa;
  imovel: Imóvel;
  afiliado: any;
  liberado: boolean;
  VerFotos?: boolean;
}) {
  const [hasUID, setHasUID] = useState<boolean>(liberado);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUID = localStorage.getItem("uid");
      if (storedUID) {
        setHasUID(true);
      }
    }
  }, []);

  const fotos = getPhotos(
    empresa,
    imovel,
    imovel?.fotos || [],
    hasUID,
    VerFotos
  );

  return (
    <ul className="w-[calc(100%-2rem)] mx-auto grid gap-2 md:grid-cols-2">
      {fotos.map(({ resized, destaque, source }, index) => {
        if (index + 1 != fotos.length) {
          return (
            <li key={index}>
              <Image
                className="rounded-[.625rem]"
                src={source.uri || resized || ""}
                alt="Imóvel"
                priority
                width={924}
                height={598}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "598px",
                  objectFit: "cover",
                }}
              />
            </li>
          );
        }

        if (hasUID) return null;
        return (
          <FormContact
            key={index}
            index={index}
            source={source}
            resized={resized}
            afiliado_id={afiliado}
            agenciador_id={imovel.agenciador_id}
            imovel_id={imovel.db_id}
            imovel_codigo={imovel.codigo}
            temporada={imovel.temporada || false}
            empresa_id={imovel.empresa_id}
          />
        );
      })}
    </ul>
  );
}
