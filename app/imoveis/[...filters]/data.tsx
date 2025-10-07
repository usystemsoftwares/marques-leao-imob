import { Empresa, Imóvel } from "smart-imob-types";
import processarFiltros from "@/utils/processar-filtros-backend";
import checkFetchStatus from "@/utils/checkFetchStatus";
import ordenacoesBackend from "@/utils/processar-ordenacoes-backend";
import { notFound } from "next/navigation";
import slugify from "slugify";

const PAGE_SIZE = 12;

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'"!:@]/g,
};

// Função auxiliar para slugificar
const slugifyString = (str: string | undefined | null) => {
  const safeStr = str || "";
  const slugfied = slugify(safeStr, slugifyOptions);
  return slugfied;
};

// Função para obter ID a partir do nome
const getIdByName = (list: any[], name: string, key: string = "nome") => {
  const item = list.find((el) => {
    const value = el[key] || el;
    if (typeof value !== "string") {
      console.warn(`Valor de '${key}' não é uma string para o item:`, el);
      return false;
    }
    return slugifyString(value) === name;
  });
  return item ? item.id || item.db_id || item[key] || item : null;
};

// Função para obter o nome original a partir do slug
const getNameBySlug = (list: any[], slug: string, key = "nome") => {
  if (!Array.isArray(list)) {
    return null;
  }

  const item = list.find((el) => {
    const value = el[key] || el;
    if (typeof value !== "string") {
      console.warn(`Valor de '${key}' não é uma string para o item:`, el);
      return false;
    }
    return slugifyString(value) === slug;
  });

  return item ? item[key] : null;
};

// Função para formatar nomes de bairros corretamente
const formatBairroName = (bairroSlug: string): string => {
  if (!bairroSlug || typeof bairroSlug !== "string") return "";

  // Decodifica URL
  let nomeBairro = decodeURIComponent(bairroSlug);
  
  // Substitui hífens por espaços
  nomeBairro = nomeBairro.replace(/-/g, ' ');
  
  // Capitaliza corretamente
  nomeBairro = nomeBairro
    .split(/\s+/)
    .map(word => {
      if (word.trim().length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    })
    .join(' ');

  return nomeBairro.trim();
};

async function getData(filtros: any): Promise<{
  imoveis: {
    nodes: Imóvel[];
    total: number;
  };
  estados: any[];
  cidades: any[];
  tipos: any[];
  codigos: any[];
  empresa: Empresa;
  bairros: any[];
  caracteristicas?: any[];
}> {
  const { pagina = 1, ordem = 1, ...rest } = filtros;
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

  const params = new URLSearchParams({
    empresa_id,
  });

  // Fetch dados básicos
  const responseEstados = await fetch(`${uri}/estados?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  await checkFetchStatus(responseEstados, "estados");
  const estados = await responseEstados.json();

  const paramsCidades = new URLSearchParams({
    empresa_id,
    site: "1",
  });

  const responseCidades = await fetch(
    `${uri}/cidades?${paramsCidades.toString()}`,
    {
      next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
    }
  );
  await checkFetchStatus(responseCidades, "cidades");
  const cidades = await responseCidades.json();

  const responseBairros = await fetch(
    `${uri}/imoveis/bairros-por-cidade?${params.toString()}`,
    {
      next: { tags: ["imoveis-info"], revalidate: 3600 },
    }
  );
  await checkFetchStatus(responseBairros, "bairros");
  const bairros = await responseBairros.json();

  const responseTipos = await fetch(
    `${uri}/imoveis/tipos-empresa?${params.toString()}`,
    {
      next: { tags: ["imoveis-info"], revalidate: 3600 },
    }
  );
  await checkFetchStatus(responseTipos, "tipos");
  const tipos = await responseTipos.json();

  // Fetch Características
  const responseCaracteristicas = await fetch(
    `${uri}/caracteristicas?${params.toString()}`,
    {
      next: { tags: ["caracteristicas"], revalidate: 3600 },
    }
  );
  const caracteristicas = responseCaracteristicas.ok ? await responseCaracteristicas.json() : [];

  // Fetch Códigos
  const responseCodigos = await fetch(
    `${uri}/imoveis/codigos?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const codigos = await responseCodigos.json();

  // Fetch Empresa
  const empresaResponse = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });

  if (!empresaResponse.ok) {
    notFound();
  }
  const empresa = await empresaResponse.json();

  // Construir filtros para API
  const apiFilters: any[] = [];

  // Filtro por estados (múltiplos)
  if (rest.estado) {
    const estadosProcessados: string[] = [];
    
    // Processar string com vírgulas
    if (typeof rest.estado === "string" && rest.estado.includes(",")) {
      const estadosSeparados = rest.estado.split(",").map((e: string) => (e || '').trim()).filter(Boolean);
      estadosSeparados.forEach((estadoSeparado: string) => {
        const estadoId = getIdByName(estados, estadoSeparado, "nome");
        if (estadoId) {
          estadosProcessados.push(estadoId);
        }
      });
    } else if (typeof rest.estado === "string") {
      const estadoId = getIdByName(estados, rest.estado, "nome");
      if (estadoId) {
        estadosProcessados.push(estadoId);
      }
    } else if (Array.isArray(rest.estado)) {
      rest.estado.forEach((estado: string) => {
        if (estado && typeof estado === "string") {
          if (estado.includes(",")) {
            const estadosSeparados = estado.split(",").map((e: string) => (e || '').trim()).filter(Boolean);
            estadosSeparados.forEach((estadoSeparado: string) => {
              const estadoId = getIdByName(estados, estadoSeparado, "nome");
              if (estadoId) {
                estadosProcessados.push(estadoId);
              }
            });
          } else {
            const estadoId = getIdByName(estados, estado, "nome");
            if (estadoId) {
              estadosProcessados.push(estadoId);
            }
          }
        }
      });
    }

    const estadosIds = Array.from(new Set(estadosProcessados)).filter(Boolean);
    
    if (estadosIds.length > 0) {
      if (estadosIds.length === 1) {
        apiFilters.push({
          field: "imovel.estado_id",
          operator: "equal",
          value: estadosIds[0],
        });
      } else {
        apiFilters.push({
          field: "imovel.estado_id",
          operator: "in",
          value: estadosIds,
        });
      }
    }
  }

  // Filtro por cidades (múltiplas)
  if (rest.cidade) {
    const cidadesProcessadas: string[] = [];

    // Processar string com vírgulas
    if (typeof rest.cidade === "string" && rest.cidade.includes(",")) {
      const cidadesSeparadas = rest.cidade.split(",").map((c: string) => c.trim()).filter(Boolean);
      cidadesSeparadas.forEach((cidadeSeparada: string) => {
        const cidadeId = getIdByName(cidades, cidadeSeparada, "nome");
        if (cidadeId) {
          cidadesProcessadas.push(cidadeId);
        }
      });
    } else if (typeof rest.cidade === "string") {
      const cidadeId = getIdByName(cidades, rest.cidade, "nome");
      if (cidadeId) {
        cidadesProcessadas.push(cidadeId);
      }
    } else if (Array.isArray(rest.cidade)) {
      rest.cidade.forEach((cidade: string) => {
        if (cidade && typeof cidade === "string") {
          if (cidade.includes(",")) {
            const cidadesSeparadas = cidade.split(",").map((c: string) => c.trim()).filter(Boolean);
            cidadesSeparadas.forEach((cidadeSeparada: string) => {
              const cidadeId = getIdByName(cidades, cidadeSeparada, "nome");
              if (cidadeId) {
                cidadesProcessadas.push(cidadeId);
              }
            });
          } else {
            const cidadeId = getIdByName(cidades, cidade, "nome");
            if (cidadeId) {
              cidadesProcessadas.push(cidadeId);
            }
          }
        }
      });
    }

    const cidadesIds = Array.from(new Set(cidadesProcessadas)).filter(Boolean);
    
    if (cidadesIds.length > 0) {
      if (cidadesIds.length === 1) {
        apiFilters.push({
          field: "imovel.cidade_id",
          operator: "equal",
          value: cidadesIds[0],
        });
      } else {
        apiFilters.push({
          field: "imovel.cidade_id",
          operator: "in",
          value: cidadesIds,
        });
      }
    }
  }

  // Filtro por bairros (múltiplos)
  if (rest.bairro) {
    // Processa bairros garantindo separação correta quando houver vírgulas
    let bairrosArray: string[] = [];

    if (Array.isArray(rest.bairro)) {
      // Se é array, ainda verifica se algum elemento tem vírgulas para separar
      bairrosArray = rest.bairro.flatMap((b: string) => {
        if (typeof b === 'string' && b.includes(',')) {
          return b.split(',').map(item => item.trim()).filter(Boolean);
        }
        return b;
      });
    } else if (typeof rest.bairro === 'string') {
      // Se for string, verifica se tem vírgulas e faz split
      bairrosArray = rest.bairro.split(',').map(b => b.trim()).filter(Boolean);
    } else {
      bairrosArray = [rest.bairro];
    }

    const bairrosNomes = bairrosArray.map(bairro => {
      if (!bairro || typeof bairro !== "string") return "";

      // Formata o nome do bairro corretamente
      const nomeFormatado = formatBairroName(bairro);
      return nomeFormatado;
    }).filter(Boolean);

    const bairrosUnicos = Array.from(new Set(bairrosNomes)).filter(Boolean);

    if (bairrosUnicos.length === 1) {
      apiFilters.push({
        field: "imovel.bairro",
        operator: "equal",
        value: bairrosUnicos[0],
      });
    } else if (bairrosUnicos.length > 1) {
      apiFilters.push({
        field: "imovel.bairro",
        operator: "in",
        value: bairrosUnicos,
      });
    }
  }

  // Filtro por tipos (múltiplos)
  if (rest.tipo) {
    const tiposProcessados: string[] = [];

    // Função auxiliar para encontrar tipo pelo slug
    const findTipoBySlug = (slug: string): string | null => {
      const tipoEncontrado = tipos.find((t: any) => {
        const tipoValue = typeof t === "string" ? t : (t.tipo || t.nome || t);
        return slugifyString(tipoValue) === slug;
      });
      return tipoEncontrado
        ? (typeof tipoEncontrado === "string" ? tipoEncontrado : (tipoEncontrado.tipo || tipoEncontrado.nome || tipoEncontrado))
        : null;
    };

    // Processar array de tipos
    if (Array.isArray(rest.tipo)) {
      rest.tipo.forEach((tipo: string) => {
        if (tipo && typeof tipo === "string") {
          const tipoNome = findTipoBySlug(tipo);
          if (tipoNome) {
            tiposProcessados.push(tipoNome);
          }
        }
      });
    } else if (typeof rest.tipo === "string") {
      // Se é string única
      const tipoNome = findTipoBySlug(rest.tipo);
      if (tipoNome) {
        tiposProcessados.push(tipoNome);
      }
    }

    const tiposUnicos = Array.from(new Set(tiposProcessados)).filter(Boolean);

    if (tiposUnicos.length === 1) {
      apiFilters.push({
        field: "imovel.tipo",
        operator: "equal",
        value: tiposUnicos[0],
      });
    } else if (tiposUnicos.length > 1) {
      apiFilters.push({
        field: "imovel.tipo",
        operator: "in",
        value: tiposUnicos,
      });
    }
  }

  // Filtro por características (múltiplas)
  if (rest.caracteristicas) {
    const caracteristicasArray = Array.isArray(rest.caracteristicas) ? rest.caracteristicas : [rest.caracteristicas];
    const caracteristicasNomes: string[] = [];
    
    caracteristicasArray.forEach((carac: string) => {
      if (carac && typeof carac === "string") {
        if (carac.includes(",")) {
          const caracSeparadas = carac.split(",").map((c) => c.trim()).filter(Boolean);
          caracSeparadas.forEach((caracSeparada) => {
            const caracNome = getNameBySlug(caracteristicas, caracSeparada, "nome");
            if (caracNome) {
              caracteristicasNomes.push(caracNome);
            }
          });
        } else {
          const caracNome = getNameBySlug(caracteristicas, carac, "nome");
          if (caracNome) {
            caracteristicasNomes.push(caracNome);
          }
        }
      }
    });

    const caracUnicos = Array.from(new Set(caracteristicasNomes)).filter(Boolean);
    
    if (caracUnicos.length > 0) {
      caracUnicos.forEach((carac) => {
        apiFilters.push({
          field: "caracteristicas",
          operator: "contains",
          value: carac,
        });
      });
    }
  }

  // Filtro por transação
  if (rest.transacao) {
    if (rest.transacao === "venda") {
      apiFilters.push({
        field: "imovel.venda",
        operator: "equal",
        value: true,
      });
    } else if (rest.transacao === "locacao") {
      apiFilters.push({
        field: "imovel.venda",
        operator: "equal",
        value: false,
      });
    }
  }

  // Filtros numéricos
  if (rest.dormitorios) {
    if (rest.dormitorios === "4+") {
      apiFilters.push({
        field: "imovel.dormitórios",
        operator: "gte",
        value: 4,
      });
    } else {
      const dormitorios = Number(rest.dormitorios);
      if (!isNaN(dormitorios)) {
        apiFilters.push({
          field: "imovel.dormitórios",
          operator: "equal",
          value: dormitorios,
        });
      }
    }
  }

  if (rest.banheiros) {
    if (rest.banheiros === "4+") {
      apiFilters.push({
        field: "imovel.banheiros",
        operator: "gte",
        value: 4,
      });
    } else {
      const banheiros = Number(rest.banheiros);
      if (!isNaN(banheiros)) {
        apiFilters.push({
          field: "imovel.banheiros",
          operator: "equal",
          value: banheiros,
        });
      }
    }
  }

  if (rest.vagas) {
    if (rest.vagas === "4+") {
      apiFilters.push({
        field: "imovel.vagas",
        operator: "gte",
        value: 4,
      });
    } else {
      const vagas = Number(rest.vagas);
      if (!isNaN(vagas)) {
        apiFilters.push({
          field: "imovel.vagas",
          operator: "equal",
          value: vagas,
        });
      }
    }
  }

  // Filtros de preço
  const precoField = rest.transacao === "locacao" ? "imovel.preço_locação" : "imovel.preço_venda";
  
  if (rest.preco_min) {
    apiFilters.push({
      field: precoField,
      operator: "gte",
      value: Number(rest.preco_min),
    });
  }

  if (rest.preco_max) {
    apiFilters.push({
      field: precoField,
      operator: "lte",
      value: Number(rest.preco_max),
    });
  }

  // Filtros de área
  if (rest.area_min) {
    apiFilters.push({
      field: "imovel.area_privativa",
      operator: "gte",
      value: Number(rest.area_min),
    });
  }

  if (rest.area_max) {
    apiFilters.push({
      field: "imovel.area_privativa",
      operator: "lte",
      value: Number(rest.area_max),
    });
  }

  // Filtro por código (único ou múltiplo)
  if (rest.codigos) {
    if (Array.isArray(rest.codigos) && rest.codigos.length > 0) {
      if (rest.codigos.length === 1) {
        apiFilters.push({
          field: "imovel.codigo",
          operator: "equal",
          value: rest.codigos[0],
        });
      } else {
        apiFilters.push({
          field: "imovel.codigo",
          operator: "in",
          value: rest.codigos,
        });
      }
    }
  } else if (rest.codigo) {
    apiFilters.push({
      field: "imovel.codigo",
      operator: "equal",
      value: rest.codigo,
    });
  }

  // Sempre incluir apenas imóveis ativos
  apiFilters.push({
    field: "imovel.ativo",
    operator: "equal",
    value: true,
  });

  console.log("[Marques] Filtros finais para API:", apiFilters);

  // Configurar ordenação
  let orderBy = [{ field: "imovel.visualizações", order: "DESC" }];

  if (rest.sort) {
    switch (rest.sort) {
      case "price-asc":
        orderBy = [{ field: precoField, order: "ASC" }];
        break;
      case "price-desc":
        orderBy = [{ field: precoField, order: "DESC" }];
        break;
      case "area-desc":
        orderBy = [{ field: "imovel.area_privativa", order: "DESC" }];
        break;
      case "newest":
        orderBy = [{ field: "imovel.created_at", order: "DESC" }];
        break;
      default:
        orderBy = [{ field: "imovel.visualizações", order: "DESC" }];
    }
  }

  const params_imoveis = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    startAt: (((pagina ?? 1) - 1) * PAGE_SIZE).toString(),
    filtros: JSON.stringify(apiFilters),
    order: JSON.stringify(orderBy),
    empresa_id,
  });

  // Fetch Imóveis
  const imoveisResponse = await fetch(
    `${uri}/imoveis/site/paginado?${params_imoveis.toString()}`,
    {
      next: { tags: ["imoveis-paginado"] },
    }
  );

  await checkFetchStatus(imoveisResponse, "imoveis");
  const imoveis = await imoveisResponse.json();

  return {
    imoveis: {
      nodes: imoveis?.nodes || [],
      total: imoveis?.total || 0,
    },
    bairros,
    estados,
    cidades,
    tipos,
    codigos,
    empresa,
    caracteristicas,
  };
}

export { getData };