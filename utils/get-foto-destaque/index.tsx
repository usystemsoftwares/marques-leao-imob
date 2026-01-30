import { Imóvel } from "smart-imob-types";
import { sanitizeImageUrl } from "@/utils/sanitize-image-url";

// Normaliza URLs removendo wrapper do CDN, se houver

export const getFotoDestaque = (
  imovel: Imóvel,
  resized?: boolean,
  resizedWEBP?: boolean
): undefined | string => {
  const fotos = imovel.fotos || [];
  const firstImage = fotos.find((image) => image.destaque);
  if (firstImage) {
    if (resized) {
      if (resizedWEBP && firstImage.resized_webp) {
        return firstImage.resized_webp);
      }
      if (resizedWEBP && firstImage.resized_md) {
        return firstImage.resized_md);
      }

      return firstImage.resized || firstImage.source.uri);
    } else {
      return firstImage.source.uri);
    }
  }

  const foto =
    fotos.find((foto) => foto.destaque) ||
    fotos.find((e) => e.ordem == 1) ||
    fotos[0];
  if (!foto) return undefined;
  if (resized) {
    if (resizedWEBP && foto.resized_webp) {
      return foto.resized_webp);
    }
    if (resizedWEBP && foto.resized_md) {
      return foto.resized_md);
    }

    return foto.resized || foto.source.uri);
  } else {
    return foto.source.uri);
  }
};
