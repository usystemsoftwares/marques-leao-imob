"use client";

import { useEffect, useState } from "react";
import { Empresa, Foto, Imóvel } from "smart-imob-types";

export function getPhotos(
  empresa: Empresa,
  imovel: Imóvel | null,
  fotos: Foto[],
  liberado: boolean,
  verFotosUrl = false
) {
  const [hasUID, setHasUID] = useState<boolean>(liberado);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUID = localStorage.getItem("uid");
      console.log('storedUID', storedUID)
      if (storedUID) {
        setHasUID(true);
      }
    }
  }, []);

  if (!fotos || fotos.length === 0) {
    return [];
  }
  console.log('hasUID', hasUID)

  const compareFunction = (a: any, b: any) =>
    parseInt(String(a.ordem)) - parseInt(String(b.ordem));
  let orderedFotos = fotos.sort(compareFunction);

  const isYoutubeVideo = imovel?.video_youtube;
  const showQuantity = empresa.bloqueio_fotos_quantidade || 4;

  let sliceLimit = Infinity;

  if (!verFotosUrl) {
    if (empresa.bloqueio_de_fotos === undefined) {
      if (imovel?.bloqueio_fotos) {
        if (!hasUID) {
          sliceLimit = isYoutubeVideo
            ? showQuantity - 1 || 2
            : showQuantity || 4;
        }
      }
    } else if (empresa.bloqueio_de_fotos && !hasUID) {
      sliceLimit = isYoutubeVideo ? showQuantity - 1 || 2 : showQuantity || 4;
    }
  }

  if (!hasUID && empresa.bloqueio_de_fotos) {
    const fotoDestaque = orderedFotos.find((foto) => foto.destaque);
    if (fotoDestaque) {
      orderedFotos = orderedFotos.filter((foto) => !foto.destaque);
    } else {
      orderedFotos = orderedFotos.filter((foto) => foto.ordem !== 1);
    }
  }

  return orderedFotos.slice(0, sliceLimit);
}
