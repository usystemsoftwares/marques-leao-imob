export const formatarTelefoneParaWhatsApp = (telefone: string): any => {
  const regex = /[^0-9]+/g;
  const telefoneFormatado = telefone.replace(regex, "");
  return `https://web.whatsapp.com/send?phone=55${telefoneFormatado}`;
};

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return phone;
  const cleaned = ("" + phone).replace(/\D/g, "");
  const withoutCountryCode = cleaned.startsWith("55")
    ? cleaned.slice(2)
    : cleaned;
  const match = withoutCountryCode.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};
