import { Imóvel } from "smart-imob-types";
import { toBRL } from "@/utils/toBrl";

export const getDisplayPrice = (estate: Imóvel): string | undefined => {
  if (
    estate.preço_venda_desconto &&
    Number(estate.preço_venda_desconto) > 0 &&
    (estate.venda_exibir_valor_no_site === undefined ||
      estate.venda_exibir_valor_no_site === true)
  ) {
    return toBRL(estate.preço_venda_desconto);
  } else if (
    estate.preço_venda &&
    (estate.venda_exibir_valor_no_site === undefined ||
      estate.venda_exibir_valor_no_site === true)
  ) {
    return toBRL(estate.preço_venda);
  }
  return 'Consulte-nos';
};
