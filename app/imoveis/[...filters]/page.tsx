import PropertyList from "./components/property-list";
import { notFound } from "next/navigation";
import slugify from "slugify";
import { getData } from "./data";

const PAGE_SIZE = 12;

const revertSlug = (slug: string, originalList: any[], key: string) => {
  const slugifyOptions = {
    lower: true,
    strict: true,
    locale: "pt",
    remove: /[*+~.()'"!:@]/g,
  };

  const originalItem = originalList.find((item) => {
    const value = item[key] || item;
    if (typeof value !== "string") {
      console.warn(
        `Esperado uma string para a chave '${key}', mas recebeu:`,
        value
      );
      return false;
    }
    const itemSlug = slugify(value, slugifyOptions);
    return itemSlug === slug;
  });

  return originalItem
    ? originalItem[key] || originalItem
    : decodeURIComponent(slug.replace(/-/g, " "));
};

export default async function ListingStayPage({
  params,
  searchParams,
}: {
  params: { filters: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters: any = {};

  (params.filters || []).forEach((segment) => {
    if (segment.startsWith("transacao-")) {
      const transacaoSlug = segment.replace("transacao-", "");
      filters.transacao = decodeURIComponent(transacaoSlug.replace(/-/g, " "));
    } else if (segment.startsWith("estado-")) {
      const estadoSlug = segment.replace("estado-", "");
      filters.estado = estadoSlug;
    } else if (segment.startsWith("cidade-")) {
      const cidadeSlug = segment.replace("cidade-", "");
      filters.cidade = cidadeSlug;
    } else if (segment.startsWith("bairro-")) {
      const bairroSlug = segment.replace("bairro-", "");
      filters.bairro = bairroSlug;
    } else if (segment.startsWith("tipo-")) {
      const tipoSlug = segment.replace("tipo-", "");
      filters.tipo = tipoSlug;
    } else if (segment.startsWith("caracteristicas-")) {
      const caracteristicasSlug = segment.replace("caracteristicas-", "");
      filters.caracteristicas = decodeURIComponent(caracteristicasSlug);
    } else if (segment.startsWith("dormitorios-")) {
      const dormitoriosSlug = segment.replace("dormitorios-", "");
      filters.dormitorios = dormitoriosSlug;
    } else if (segment.startsWith("vagas-")) {
      const vagasSlug = segment.replace("vagas-", "");
      filters.vagas = vagasSlug;
    } else if (segment.startsWith("preco-min-")) {
      const valorMin = Number(segment.replace("preco-min-", ""));
      if (!isNaN(valorMin)) {
        filters.preco_min = valorMin;
      }
    } else if (segment.startsWith("preco-max-")) {
      const valorMax = Number(segment.replace("preco-max-", ""));
      if (!isNaN(valorMax)) {
        filters.preco_max = valorMax;
      }
    } else if (segment.startsWith("codigos-")) {
      // Novo formato: codigos-123,456-789
      const codigosSlug = decodeURIComponent(segment.replace("codigos-", ""));
      // Aceita hífen ou vírgula como separador
      filters.codigos = codigosSlug.split(/[-,]/).map(c => c.trim()).filter(Boolean);
    } else if (segment.startsWith("codigo-")) {
      // Retrocompatibilidade: codigo-123
      const codigoSlug = segment.replace("codigo-", "");
      filters.codigos = [codigoSlug];
    } else if (segment.startsWith("pagina-")) {
      const paginaNum = Number(segment.replace("pagina-", ""));
      if (!isNaN(paginaNum)) {
        filters.pagina = paginaNum;
      }
    } else if (segment.startsWith("total-")) {
      const totalNum = Number(segment.replace("total-", ""));
      if (!isNaN(totalNum)) {
        filters.total = totalNum;
      }
    }
  });

  // Extração dos parâmetros de consulta para paginação
  const pagina = Number(filters.pagina ?? searchParams.pagina ?? "1");

  // Chamar getData com os filtros extraídos
  const { imoveis, estados, cidades, tipos, codigos, empresa, bairros } =
    await getData(filters);

  // Reverter slugs para nomes reais usando as listas obtidas
  if (filters.estado) {
    filters.estado = revertSlug(filters.estado, estados, "nome");
  }
  if (filters.cidade) {
    filters.cidade = revertSlug(filters.cidade, cidades, "nome");
  }
  if (filters.bairro) {
    filters.bairro = revertSlug(filters.bairro, bairros, "bairro");
  }
  if (filters.tipo) {
    filters.tipo = revertSlug(filters.tipo, tipos, "tipo");
  }

  // Validação dos filtros
  const estadoValido = filters.estado
    ? estados.some((e) => e.nome.toLowerCase() === filters.estado.toLowerCase())
    : true;
  const cidadeValida = filters.cidade
    ? cidades.some((c) => c.nome.toLowerCase() === filters.cidade.toLowerCase())
    : true;
  const bairroValido = filters.bairro
    ? bairros.some(
        (b) => (b.bairro || "").toLowerCase() === filters.bairro.toLowerCase()
      )
    : true;
  const tipoValido = filters.tipo
    ? tipos.some((t) => t.toLowerCase() === filters.tipo.toLowerCase())
    : true;
  // Padronizar todos os códigos para string
  const codigosStr = (codigos || []).map(String);
  // Validação dos códigos (agora array)
  const codigosValidos = filters.codigos
    ? filters.codigos.every((codigo: string) => codigosStr.some((c: string) => c.toLowerCase() === codigo.toLowerCase()))
    : true;
  console.log('codigosStr', codigosStr);
  console.log('filters', filters);
  console.log('codigosValidos', codigosValidos);

  if (
    (filters.estado && !estadoValido) ||
    (filters.cidade && !cidadeValida) ||
    (filters.bairro && !bairroValido) ||
    (filters.tipo && !tipoValido) ||
    (filters.codigos && !codigosValidos)
  ) {
    console.warn("Filtros inválidos encontrados, redirecionando para 404.");
    notFound();
  }

  const totalPages = Math.ceil(imoveis.total / PAGE_SIZE);
  return (
    <div>
      <PropertyList
        imoveis={imoveis.nodes}
        estados={estados}
        cidades={cidades}
        bairros={bairros}
        tipos={tipos}
        codigos={codigos}
        pages={totalPages}
        page={pagina}
        query={filters}
        filters={params.filters}
        pathname={`/imoveis/${(params.filters || []).join("/")}`}
        empresa={empresa}
      />
    </div>
  );
}
