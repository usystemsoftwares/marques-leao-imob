"use client";

import React, { useEffect, useState } from "react";
import { Empresa, Imóvel } from "smart-imob-types";
import FormContact from "./form-contact";
import { getPhotos } from "@/utils/get-photos";
import CarouselPhotos from "./carousel-photos";
import { sanitizeImageUrl } from "@/utils/sanitize-image-url";
import { applyCdn } from "@/utils/cdn";
import ProtectedImage from "@/components/protected-image";

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
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedUID: string | null = null;
      try {
        storedUID = localStorage.getItem("uid");
      } catch (e) {
        try {
          storedUID = sessionStorage.getItem("uid");
        } catch (e2) {
          // sem storage disponível
        }
      }
      if (storedUID) {
        setHasUID(true);
      }

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isDesktopOrTablet = windowWidth !== null && windowWidth >= 768;

  // Marca d'água do template (overlay do logo): respeita a config da empresa.
  //const logoMarca = empresa.ocultar_marca_agua ? "" : (empresa.logo || "");
  const logoMarca = empresa.logo || "";

  const fotos = getPhotos(
    empresa,
    imovel,
    imovel?.fotos || [],
    hasUID,
    VerFotos
  );

  if (hasUID && isDesktopOrTablet) {
    return (
      <div className="w-full mx-auto">
        <CarouselPhotos images={fotos} logo={logoMarca} />
      </div>
    );
  } else {
    return (
      <ul className="w-[calc(100%-2rem)] mx-auto grid gap-2 md:grid-cols-2">
        {fotos.map(({ resized, destaque, source }, index) => {
          const isLast = index + 1 === fotos.length;
          // Renderiza a foto para todas as posições, exceto a última quando o
          // usuário NÃO é liberado (aí o último slot vira o gate de contato).
          if (!isLast || hasUID) {
            return (
              <li key={index} className="relative">
                <ProtectedImage
                  className="rounded-[.625rem]"
                  src={applyCdn(sanitizeImageUrl(source.uri || resized)) || ""}
                  alt="Imóvel"
                  priority
                  width={924}
                  height={598}
                  style={{
                    maxWidth: "100%",
                    height: "100%",
                    maxHeight: "598px",
                    objectFit: "cover",
                  }}
                  quality={100}
                />
                {logoMarca && (
                  <div className="absolute top-2 right-2">
                    <ProtectedImage
                      src={applyCdn(sanitizeImageUrl(logoMarca)) || ""}
                      alt="Logo da empresa"
                      width={150}
                      height={75}
                      className="opacity-80"
                    />
                  </div>
                )}
              </li>
            );
          }

          // Aqui só chega a ÚLTIMA foto de usuário NÃO liberado: gate de contato.
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
}
