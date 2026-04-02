const formatter = Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatterDolar = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatterEuro = Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

/**
 * Transform the number value to BRL
 * @param {Number} num - The number that will change.
 */
export const toBRL = (value: number | bigint, type?: string) => {
  if (!type) return formatter.format(value);
  if (type === "Real") return formatter.format(value);
  if (type === "Dolar") return formatterDolar.format(value);
  if (type === "Euro") return formatterEuro.format(value);
};
