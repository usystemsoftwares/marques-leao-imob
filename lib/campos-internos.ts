// A API devolve campos de uso interno mesmo nos endpoints publicos
// (/imoveis/site/*, /empreendimentos/*). O Next serializa as props dos Server
// Components no HTML (self.__next_f), entao tudo que chega num componente
// "use client" aparece no "ver codigo fonte" — mesmo sem ser renderizado.
//
// No site isso expunha a Descricao Interna ("AVALIA PERMUTA"),
// a descricao da chave ("Chaves: Agendar com Juliana") e ids de proprietario.
// O CRM promete que esses campos nao aparecem no site.
//
// A limpeza fica no fetchAPI, e nao em cada pagina, porque quase todo
// componente da home e da listagem e client: bastaria uma pagina nova esquecer
// de sanitizar pra reabrir o vazamento.
const CAMPOS_INTERNOS = new Set([
  'desc_interna',
  'chave_desc',
  'proprietario',
  'proprietario_id',
  'cadastrador_id',
  'propostas',
  'aut_visita',
  'venda_imovel',
  'aluguel_imovel',
]);

export function removerCamposInternos<T>(dado: T, profundidade = 0): T {
  // Guarda contra payload ciclico/muito aninhado; as respostas reais tem 3-4 niveis.
  if (profundidade > 8 || dado === null || typeof dado !== 'object') return dado;

  if (Array.isArray(dado)) {
    return dado.map((item) => removerCamposInternos(item, profundidade + 1)) as unknown as T;
  }

  const limpo: any = {};
  for (const [chave, valor] of Object.entries(dado as any)) {
    if (CAMPOS_INTERNOS.has(chave)) continue;
    limpo[chave] = removerCamposInternos(valor, profundidade + 1);
  }
  return limpo as T;
}
