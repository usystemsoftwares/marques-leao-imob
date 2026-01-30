import { Imóvel } from "smart-imob-types";

// CDN disabled - function returns URL unchanged
const getCdnUrl = (url: string | undefined | null): string => url || "";

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
        return getCdnUrl(firstImage.resized_webp);
      }
      if (resizedWEBP && firstImage.resized_md) {
        return getCdnUrl(firstImage.resized_md);
      }

      return getCdnUrl(firstImage.resized || firstImage.source.uri);
    } else {
      return getCdnUrl(firstImage.source.uri);
    }
  }

  const foto =
    fotos.find((foto) => foto.destaque) ||
    fotos.find((e) => e.ordem == 1) ||
    fotos[0];
  if (!foto) return undefined;
  if (resized) {
    if (resizedWEBP && foto.resized_webp) {
      return getCdnUrl(foto.resized_webp);
    }
    if (resizedWEBP && foto.resized_md) {
      return getCdnUrl(foto.resized_md);
    }

    return getCdnUrl(foto.resized || foto.source.uri);
  } else {
    return getCdnUrl(foto.source.uri);
  }
};
