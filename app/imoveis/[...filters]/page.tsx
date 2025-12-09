import PropertyList from "./components/property-list";
import { notFound } from "next/navigation";
import slugify from "slugify";
import { getData } from "./data";

const PAGE_SIZE = 12;

// Configuração do slugify
const slugifyOptions = {
  lower: true,
  strict: false,
  locale: "pt",
  remove: /[*+~.'"!:@]/g,
};

// Função para slugificar strings com validação
const slugifyString = (str: any) => {
  if (typeof str !== "string" || !str) {
    return "";
  }
  try {
    return slugify(str || "", slugifyOptions || {});
  } catch (error) {
    console.error(`Erro ao slugificar valor: ${str}`, error);
    return "";
  }
};

// Função para formatar nomes de bairros corretamente
const formatBairroName = (bairroSlug: string): string => {
  if (!bairroSlug || typeof bairroSlug !== "string") return "";

  // Decodifica URL
  let nomeBairro = decodeURIComponent(bairroSlug);
  
  // Substitui hífens por espaços
  nomeBairro = nomeBairro.replace(/-/g, ' ');
  
  // Restaura padrões com parênteses
  const patternsWithParentheses = [
    { regex: /distrito litoral/gi, replacement: '(Distrito Litoral)' },
    { regex: /distrito rural/gi, replacement: '(Distrito Rural)' },
    { regex: /distrito industrial/gi, replacement: '(Distrito Industrial)' },
    { regex: /zona rural/gi, replacement: '(Zona Rural)' },
    { regex: /zona urbana/gi, replacement: '(Zona Urbana)' },
    { regex: /centro histórico/gi, replacement: '(Centro Histórico)' },
  ];

  patternsWithParentheses.forEach(pattern => {
    nomeBairro = nomeBairro.replace(pattern.regex, pattern.replacement);
  });

  // Capitaliza corretamente preservando parênteses
  nomeBairro = nomeBairro
    .split(/(\s+)/)
    .map(word => {
      if (word.startsWith('(') && word.length > 1) {
        // Palavras entre parênteses
        const insideParentheses = word.slice(1);
        const formattedInside = insideParentheses
          .split(/(\s+)/)
          .map(innerWord => {
            if (innerWord.trim().length > 0) {
              return innerWord.charAt(0).toUpperCase() + innerWord.slice(1).toLowerCase();
            }
            return innerWord;
          })
          .join('');
        return '(' + formattedInside;
      } else if (word.includes(')') && !word.startsWith('(')) {
        // Fecha parênteses
        return word;
      } else if (word.trim().length > 0 && !word.match(/^[\(\)]$/)) {
        // Palavras normais
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    })
    .join('');

  // Remove espaços extras e formata consistentemente
  nomeBairro = nomeBairro
    .replace(/\s+/g, ' ')
    .replace(/\s*\(\s*/g, ' (')
    .replace(/\s*\)\s*/g, ') ')
    .trim();

  return nomeBairro;
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
      filters.transacao = transacaoSlug;
    } else if (segment.startsWith("estado-")) {
      const estadoSlug = segment.replace("estado-", "");
      filters.estado = estadoSlug
        .split(",")
        .map((slug) => {
          const decodedSlug = decodeURIComponent(slug.trim());
          return decodedSlug || slug.trim();
        })
        .filter(Boolean);
    } else if (segment.startsWith("cidade-")) {
      const cidadeSlug = segment.replace("cidade-", "");
      filters.cidade = cidadeSlug
        .split(",")
        .map((slug) => {
          const decodedSlug = decodeURIComponent(slug.trim());
          return decodedSlug || slug.trim();
        })
        .filter(Boolean);
    } else if (segment.startsWith("bairro-") || segment.startsWith("bairros-")) {
      const bairroSlug = segment.replace(/^bairros?-/, "");
      filters.bairro = bairroSlug
        .split(",")
        .map((slug) => {
          const decodedSlug = decodeURIComponent(slug.trim());
          return decodedSlug || slug.trim();
        })
        .filter(Boolean);
    } else if (segment.startsWith("tipo-")) {
      const tipoSlug = segment.replace("tipo-", "");
      // Decodificar ANTES de fazer o split
      const decodedTipoSlug = decodeURIComponent(tipoSlug);

      const tiposArray: string[] = [];
      const firstSplit = decodedTipoSlug.split(",");

      firstSplit.forEach((item) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
          tiposArray.push(trimmedItem);
        }
      });

      filters.tipo = tiposArray;
    } else if (segment.startsWith("caracteristicas-")) {
      const caracteristicasSlug = segment.replace("caracteristicas-", "");
      filters.caracteristicas = caracteristicasSlug
        .split(",")
        .map((slug) => {
          const decodedSlug = decodeURIComponent(slug.trim());
          return decodedSlug || slug.trim();
        })
        .filter(Boolean);
    } else if (segment.startsWith("dormitorios-")) {
      const dormitoriosStr = segment.replace("dormitorios-", "");
      const decodedStr = decodeURIComponent(dormitoriosStr).trim();

      if (decodedStr === "4+" || decodedStr === "4 ") {
        filters.dormitorios = "4+";
      } else {
        const dormitorios = Number(decodedStr);
        if (!isNaN(dormitorios)) {
          filters.dormitorios = dormitorios.toString();
        }
      }
    } else if (segment.startsWith("suites-")) {
      const suitesStr = segment.replace("suites-", "");
      const decodedStr = decodeURIComponent(suitesStr).trim();

      if (decodedStr === "4+" || decodedStr === "4 ") {
        filters.suites = "4+";
      } else {
        const suites = Number(decodedStr);
        if (!isNaN(suites)) {
          filters.suites = suites.toString();
        }
      }
    } else if (segment.startsWith("banheiros-")) {
      const banheirosStr = segment.replace("banheiros-", "");
      const decodedStr = decodeURIComponent(banheirosStr).trim();

      if (decodedStr === "4+" || decodedStr === "4 ") {
        filters.banheiros = "4+";
      } else {
        const banheiros = Number(decodedStr);
        if (!isNaN(banheiros)) {
          filters.banheiros = banheiros.toString();
        }
      }
    } else if (segment.startsWith("vagas-")) {
      const vagasStr = segment.replace("vagas-", "");
      const decodedStr = decodeURIComponent(vagasStr).trim();

      if (decodedStr === "4+" || decodedStr === "4 ") {
        filters.vagas = "4+";
      } else {
        const vagas = Number(decodedStr);
        if (!isNaN(vagas)) {
          filters.vagas = vagas.toString();
        }
      }
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
    } else if (segment.startsWith("area-min-")) {
      const areaMin = Number(segment.replace("area-min-", ""));
      if (!isNaN(areaMin)) {
        filters.area_min = areaMin;
      }
    } else if (segment.startsWith("area-max-")) {
      const areaMax = Number(segment.replace("area-max-", ""));
      if (!isNaN(areaMax)) {
        filters.area_max = areaMax;
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
    } else if (segment.startsWith("sort-") || segment.startsWith("ordenacao-")) {
      const sortValue = segment.replace(/^(sort|ordenacao)-/, "");
      filters.sort = sortValue;
    } else if (segment.startsWith("lancamento-")) {
      const lancamentoValue = segment.replace("lancamento-", "");
      filters.lancamento = lancamentoValue === "true";
    }
  });

  // Extração dos parâmetros de consulta para paginação
  const pagina = Number(filters.pagina ?? searchParams.pagina ?? "1");

  // Chamar getData com os filtros extraídos
  const { imoveis, estados, cidades, tipos, codigos, empresa, bairros } =
    await getData(filters);

  // Função para obter o nome real a partir do slug
  const getNameBySlug = (list: any[], slug: string, key = "nome") => {
    if (!Array.isArray(list) || !slug) return slug;
    
    const item = list.find((el) => {
      const value = el[key] || el;
      if (typeof value !== "string") return false;
      return slugifyString(value) === slug;
    });
    
    return item ? item[key] || item : slug;
  };

  // Reverter slugs para nomes reais para exibir nos filtros
  const displayFilters = { ...filters };
  
  // Reverter estado - mantendo como array para suportar múltipla seleção
  if (filters.estado) {
    if (Array.isArray(filters.estado)) {
      // Reverter cada estado do array
      displayFilters.estado = filters.estado.map((estadoSlug: string) => 
        getNameBySlug(estados, estadoSlug, "nome")
      );
    } else {
      // Se for string única, converter para array
      displayFilters.estado = [getNameBySlug(estados, filters.estado, "nome")];
    }
  }
  
  // Reverter cidade - tratando arrays e vírgulas
  if (filters.cidade) {
    const cidadesList: string[] = [];
    
    if (Array.isArray(filters.cidade)) {
      // Se é um array, processar cada elemento
      filters.cidade.forEach((cidadeItem: string) => {
        if (cidadeItem.includes(',')) {
          // Se tem vírgula, fazer split
          cidadeItem.split(',').forEach(slug => {
            const nome = getNameBySlug(cidades, slug.trim(), "nome");
            if (nome) cidadesList.push(nome);
          });
        } else {
          const nome = getNameBySlug(cidades, cidadeItem, "nome");
          if (nome) cidadesList.push(nome);
        }
      });
    } else {
      // Se não é array mas tem vírgula, fazer split
      if (filters.cidade.includes(',')) {
        filters.cidade.split(',').forEach((slug: string) => {
          const nome = getNameBySlug(cidades, slug.trim(), "nome");
          if (nome) cidadesList.push(nome);
        });
      } else {
        const nome = getNameBySlug(cidades, filters.cidade, "nome");
        if (nome) cidadesList.push(nome);
      }
    }
    
    displayFilters.cidade = cidadesList;
  }
  
// Reverter bairro - tratando arrays e vírgulas
  if (filters.bairro) {
    const bairrosList: string[] = [];
    
    if (Array.isArray(filters.bairro)) {
      // Se é um array, processar cada elemento
      filters.bairro.forEach((bairroItem: string) => {
        if (bairroItem.includes(',')) {
          // Se tem vírgula, fazer split
          bairroItem.split(',').forEach(slug => {
            const bairroEncontrado = bairros.find((b: any) => {
              const bairroNome = b.bairro || b.nome || b;
              const bairroSlug = slugifyString(bairroNome);
              return bairroSlug === slug.trim();
            });
            const nome = bairroEncontrado ? 
              (bairroEncontrado.bairro || bairroEncontrado.nome || bairroEncontrado) : 
              formatBairroName(slug.trim());
            if (nome) bairrosList.push(nome);
          });
        } else {
          const bairroEncontrado = bairros.find((b: any) => {
            const bairroNome = b.bairro || b.nome || b;
            const bairroSlug = slugifyString(bairroNome);
            return bairroSlug === bairroItem;
          });
          const nome = bairroEncontrado ? 
            (bairroEncontrado.bairro || bairroEncontrado.nome || bairroEncontrado) : 
            formatBairroName(bairroItem);
          if (nome) bairrosList.push(nome);
        }
      });
    } else {
      // Se não é array mas tem vírgula, fazer split
      if (filters.bairro.includes(',')) {
        filters.bairro.split(',').forEach((slug: string) => {
          const bairroEncontrado = bairros.find((b: any) => {
            const bairroNome = b.bairro || b.nome || b;
            const bairroSlug = slugifyString(bairroNome);
            return bairroSlug === slug.trim();
          });
          const nome = bairroEncontrado ? 
            (bairroEncontrado.bairro || bairroEncontrado.nome || bairroEncontrado) : 
            formatBairroName(slug.trim());
          if (nome) bairrosList.push(nome);
        });
      } else {
        const bairroEncontrado = bairros.find((b: any) => {
          const bairroNome = b.bairro || b.nome || b;
          const bairroSlug = slugifyString(bairroNome);
          return bairroSlug === filters.bairro;
        });
        const nome = bairroEncontrado ? 
          (bairroEncontrado.bairro || bairroEncontrado.nome || bairroEncontrado) : 
          formatBairroName(filters.bairro);
        if (nome) bairrosList.push(nome);
      }
    }
    
    displayFilters.bairro = bairrosList;
  }
  
  // Reverter tipo - mantendo como array para suportar múltipla seleção
  if (filters.tipo) {
    if (Array.isArray(filters.tipo)) {
      // Reverter cada tipo do array
      displayFilters.tipo = filters.tipo.map((tipoSlug: string) => {
        // Tentar encontrar o tipo comparando diferentes estruturas
        const tipoEncontrado = tipos.find(t => {
          const tipoValue = typeof t === "string" ? t : (t.tipo || t.nome || t);
          const tipoSlugified = slugifyString(String(tipoValue));
          return tipoSlugified === tipoSlug;
        });
        return tipoEncontrado
          ? (typeof tipoEncontrado === "string" ? tipoEncontrado : (tipoEncontrado.tipo || tipoEncontrado.nome || tipoEncontrado))
          : tipoSlug;
      });
    } else {
      // Se for string única, converter para array
      const tipoEncontrado = tipos.find(t => {
        const tipoValue = typeof t === "string" ? t : (t.tipo || t.nome || t);
        return slugifyString(String(tipoValue)) === filters.tipo;
      });
      displayFilters.tipo = [tipoEncontrado
        ? (typeof tipoEncontrado === "string" ? tipoEncontrado : (tipoEncontrado.tipo || tipoEncontrado.nome || tipoEncontrado))
        : filters.tipo];
    }
  }

  // Validação dos filtros (simplificada já que a validação real acontece no data.tsx)
  // Se nenhum imóvel foi encontrado e há filtros aplicados, pode ser um filtro inválido
  if (imoveis.total === 0 && Object.keys(filters).length > 1) {
    // Permitir página sem resultados ao invés de 404
    console.log("Nenhum imóvel encontrado com os filtros aplicados.");
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
        query={displayFilters}
        filters={params.filters}
        pathname={`/imoveis/${(params.filters || []).join("/")}`}
        empresa={empresa}
      />
    </div>
  );
}
