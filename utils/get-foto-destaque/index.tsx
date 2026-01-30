import { Imóvel } from "smart-imob-types";
import { sanitizeImageUrl } from "@/utils/sanitize-image-url";

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
        return sanitizeImageUrl(firstImage.resized_webp);
      }
      if (resizedWEBP && firstImage.resized_md) {
        return sanitizeImageUrl(firstImage.resized_md);
      }

      return sanitizeImageUrl(firstImage.resized || firstImage.source.uri);
    } else {
      return sanitizeImageUrl(firstImage.source.uri);
    }
  }

  const foto =
    fotos.find((foto) => foto.destaque) ||
    fotos.find((e) => e.ordem == 1) ||
    fotos[0];
  if (!foto) return undefined;
  if (resized) {
    if (resizedWEBP && foto.resized_webp) {
      return sanitizeImageUrl(foto.resized_webp);
    }
    if (resizedWEBP && foto.resized_md) {
      return sanitizeImageUrl(foto.resized_md);
    }

    return sanitizeImageUrl(foto.resized || foto.source.uri);
  } else {
    return sanitizeImageUrl(foto.source.uri);
  }
};
