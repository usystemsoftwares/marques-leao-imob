import { Corretor } from "smart-imob-types";
import { formatarTelefoneParaWhatsApp } from "./formatarTelefoneParaWhatsApp";

export const TelefoneFormatter = (telefone: string) => {
  return telefone
    .replace("(", "")
    .replace(")", "")
    .replace("-", "")
    .replace(" ", "");
};

function getWhatsappLink(corretor: Corretor) {
  if (corretor.whatsapp_link) {
    return corretor.whatsapp_link;
  } else {
    return formatarTelefoneParaWhatsApp(corretor.telefone || '');
  }
}

export default getWhatsappLink;
