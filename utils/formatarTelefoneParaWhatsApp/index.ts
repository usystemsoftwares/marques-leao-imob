export const formatarTelefoneParaWhatsApp = (telefone: string): any => {
  const regex = /[^0-9]+/g;
  const telefoneFormatado = telefone.replace(regex, "");
  return `https://web.whatsapp.com/send?phone=55${telefoneFormatado}`;
};
