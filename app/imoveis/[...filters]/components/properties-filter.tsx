"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import slugify from "slugify";

const sideVariants = {
  closed: {
    display: "var(--display-from, none)",
    opacity: "var(--opacity-from, 0)",
  },
  open: {
    display: "var(--display-to, block)",
    opacity: "var(--opacity-to, 9)",
  },
};

// Opções para slugify movidas para fora do componente
const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'\"!:@]/g,
};

// Função auxiliar para slugificar movida para fora do componente
const slugifyString = (str: string) => slugify(str, slugifyOptions);

type FormProps = {
  className?: string;
  estados: any[];
  cidades: any[];
  bairros: any[];
  tipos: any[];
  codigos: string[];
  searchParams: any;
};

const PropertiesFilter = ({
  className,
  estados,
  cidades,
  bairros,
  tipos,
  codigos,
  searchParams,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLFormElement | null>(null);

  // Função para obter valores iniciais como array
  const getInitialArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string" && value.includes(',')) {
      return value.split(',').map(v => v.trim());
    }
    return [value];
  };

  // Estados para múltipla seleção
  const [selectedEstados, setSelectedEstados] = useState<string[]>(() => {
    const valores = getInitialArray(searchParams?.estado);
    return valores.map(v => {
      const estado = estados.find(e => e.nome === v || slugifyString(e.nome) === v);
      return estado ? slugifyString(estado.nome) : v;
    });
  });

  const [selectedCidades, setSelectedCidades] = useState<string[]>(() => {
    const valores = getInitialArray(searchParams?.cidade);
    return valores.map(v => {
      const cidade = cidades.find(c => c.nome === v || slugifyString(c.nome) === v);
      return cidade ? slugifyString(cidade.nome) : v;
    });
  });

  const [selectedBairros, setSelectedBairros] = useState<string[]>(() => {
    const valores = getInitialArray(searchParams?.bairro);
    return valores.map(v => {
      const bairro = bairros.find(b => {
        const nome = b.bairro || b.nome || b;
        return nome === v || slugifyString(nome) === v;
      });
      return bairro ? slugifyString(bairro.bairro || bairro.nome || bairro) : v;
    });
  });

  const [selectedTipos, setSelectedTipos] = useState<string[]>(() => {
    const valores = getInitialArray(searchParams?.tipo);
    return valores.map(v => {
      // Tentar encontrar o tipo comparando nome, tipo ou string diretamente
      const tipo = tipos.find(t => {
        const tipoValue = typeof t === "string" ? t : (t.tipo || t.nome);
        return tipoValue === v || slugifyString(tipoValue) === slugifyString(v);
      });
      const tipoValue = tipo ? (typeof tipo === "string" ? tipo : (tipo.tipo || tipo.nome)) : v;
      return slugifyString(tipoValue);
    });
  });

  const [codigo, setCodigo] = useState<string>(
    searchParams?.codigo || searchParams?.codigos || ""
  );
  const [codigoInput, setCodigoInput] = useState<string>(
    searchParams?.codigo || searchParams?.codigos || ""
  );
  const [codigoSuggestions, setCodigoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [valorMin, setValorMin] = useState<number | "">(
    searchParams?.preco_min || searchParams?.["imovel.preco_min"] || ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.preco_max || searchParams?.["imovel.preco_max"] || ""
  );

  const [filteredDistricts, setFilteredDistricts] = useState(bairros);
  
  // Estados para controlar se os selects permanecem abertos
  const [estadosOpen, setEstadosOpen] = useState(false);
  const [cidadesOpen, setCidadesOpen] = useState(false);
  const [bairrosOpen, setBairrosOpen] = useState(false);
  const [tiposOpen, setTiposOpen] = useState(false);
  
  useEffect(() => {
    const cidadesSelecionadas = selectedCidades.map(cidadeSlug => {
      const cidade = cidades.find(c => slugifyString(c.nome) === cidadeSlug);
      return cidade?.nome;
    }).filter(Boolean);

    setFilteredDistricts(
      (bairros ?? []).filter(
        (bairro: any) =>
          cidadesSelecionadas.length > 0 &&
          cidadesSelecionadas.includes(bairro?.cidadeNome)
      )
    );
  }, [selectedCidades, bairros, cidades]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isOpen) return;
      
      // Se qualquer select estiver aberto, não faz nada
      if (estadosOpen || cidadesOpen || bairrosOpen || tiposOpen) {
        return;
      }
      
      const target = e.target as HTMLElement;
      
      // Verifica se o clique foi dentro do formulário
      const clickedInsideForm = inputRef.current?.contains(target);
      
      // Só fecha o menu se clicou fora do formulário
      if (!clickedInsideForm) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen, estadosOpen, cidadesOpen, bairrosOpen, tiposOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Fechar o menu de filtros
    setIsOpen(false);

    // Construir segmentos de URL baseados nos nomes selecionados com prefixos
    const urlSegments = [];

    // Estados múltiplos
    if (selectedEstados.length > 0) {
      urlSegments.push(`estado-${selectedEstados.join(',')}`);
    }

    // Cidades múltiplas
    if (selectedCidades.length > 0) {
      urlSegments.push(`cidade-${selectedCidades.join(',')}`);
    }

    // Bairros múltiplos
    if (selectedBairros.length > 0) {
      urlSegments.push(`bairro-${selectedBairros.join(',')}`);
    }

    // Tipos múltiplos
    if (selectedTipos.length > 0) {
      urlSegments.push(`tipo-${selectedTipos.join(',')}`);
    }

    if (valorMin) urlSegments.push(`preco-min-${valorMin}`);
    if (valorMax) urlSegments.push(`preco-max-${valorMax}`);
    if (codigo) urlSegments.push(`codigo-${slugifyString(codigo)}`);

    // Construir a URL final
    const url = urlSegments.length > 0 
      ? `/imoveis/${urlSegments.join("/")}` 
      : `/imoveis`;
    
    // Navegar usando router.push
    router.push(url);
  };

  const getSelectedFilters = () => {
    const filters: string[] = [];

    // Adicionar estados selecionados
    selectedEstados.forEach(estadoSlug => {
      const estado = estados.find(e => slugifyString(e.nome) === estadoSlug);
      if (estado) filters.push(estado.sigla);
    });

    // Adicionar cidades selecionadas
    selectedCidades.forEach(cidadeSlug => {
      const cidade = cidades.find(c => slugifyString(c.nome) === cidadeSlug);
      if (cidade) filters.push(cidade.nome);
    });

    // Adicionar bairros selecionados
    selectedBairros.forEach(bairroSlug => {
      const bairro = filteredDistricts.find(b => slugifyString(b.bairro || b.nome) === bairroSlug);
      if (bairro) filters.push(bairro.bairro || bairro.nome);
    });

    // Adicionar tipos selecionados
    selectedTipos.forEach(tipoSlug => {
      const tipo = tipos.find(t => slugifyString(t) === tipoSlug);
      if (tipo) filters.push(tipo);
    });

    if (codigo) {
      filters.push(codigo);
    }

    if (valorMin !== "") {
      filters.push(`R$${valorMin.toLocaleString("pt-BR")}`);
    }

    if (valorMax !== "") {
      filters.push(`R$${valorMax.toLocaleString("pt-BR")}`);
    }

    return filters.join(", ");
  };

  const tiposOptions = tipos.length > 0 ? tipos : [
    "Apartamento",
    "Casa",
    "Casa em Condomínio",
    "Cobertura",
    "Terreno",
    "Terreno em Condomínio",
  ];

  useEffect(() => {
    if (codigoInput) {
      const filtered = codigos.filter((codigoItem) =>
        codigoItem.toLowerCase().includes(codigoInput.toLowerCase())
      );
      setCodigoSuggestions(filtered);
    } else {
      setCodigoSuggestions([]);
    }
  }, [codigoInput, codigos]);

  return (
    <form
      className={cn("group bg-white py-3 px-3 rounded-[.625rem]", className)}
      ref={inputRef}
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between w-full">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-[60%] flex-1 pl-10 bg-hero-input bg-no-repeat bg-left placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none"
          onClick={toggleMenu}
          readOnly
          value={getSelectedFilters()}
        />
        <button
          className="bg-[#2a2b2f] text-[.75rem] py-2 px-6 rounded-lg text-white hover:bg-[#1a1b1f] transition-colors"
          type="submit"
        >
          Buscar imóveis
        </button>
      </div>
      <motion.div
        className="bg-white [--display-from:none] [--display-to:block] [--opacity-from:0] [--opacity-to:90%] *:text-black *:font-semibold z-50 absolute py-4 px-5 w-full bottom-0 translate-y-full left-0 md:gap-3 rounded-[.625rem]"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div className="max-w-[37.5rem] px-3 mx-auto *:flex *:flex-wrap *:justify-center *:items-center">
          <div className="*:w-[10.5rem] gap-4 *:rounded-xl *:border-black *:border">
            {/* Estados - Múltipla seleção */}
            <Select
              value=""
              open={estadosOpen}
              onOpenChange={setEstadosOpen}
              onValueChange={(value) => {
                if (value === "clear-all") {
                  setSelectedEstados([]);
                  setEstadosOpen(false);
                } else {
                  const estadoSlug = slugifyString(value);
                  if (selectedEstados.includes(estadoSlug)) {
                    setSelectedEstados(selectedEstados.filter(e => e !== estadoSlug));
                  } else {
                    setSelectedEstados([...selectedEstados, estadoSlug]);
                  }
                  setEstadosOpen(true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedEstados.length > 0 ? `${selectedEstados.length} selecionado(s)` : "Estados"} />
              </SelectTrigger>
              <SelectContent className="select-content">
                {selectedEstados.length > 0 && (
                  <SelectItem value="clear-all">✕ Limpar</SelectItem>
                )}
                {estados
                  .filter((estadoItem: any) => estadoItem.sigla !== "PA")
                  .map((estadoItem) => (
                    <SelectItem
                      key={estadoItem.nome}
                      value={estadoItem.nome}
                    >
                      {selectedEstados.includes(slugifyString(estadoItem.nome)) ? "✓ " : ""}
                      {estadoItem.sigla}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Cidades - Múltipla seleção */}
            <Select
              value=""
              open={cidadesOpen}
              onOpenChange={setCidadesOpen}
              onValueChange={(value) => {
                if (value === "clear-all") {
                  setSelectedCidades([]);
                  setCidadesOpen(false);
                } else {
                  const cidadeSlug = slugifyString(value);
                  if (selectedCidades.includes(cidadeSlug)) {
                    setSelectedCidades(selectedCidades.filter(c => c !== cidadeSlug));
                  } else {
                    setSelectedCidades([...selectedCidades, cidadeSlug]);
                  }
                  setCidadesOpen(true);
                }
              }}
              disabled={selectedEstados.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCidades.length > 0 ? `${selectedCidades.length} selecionada(s)` : "Cidades"} />
              </SelectTrigger>
              <SelectContent className="select-content">
                {selectedCidades.length > 0 && (
                  <SelectItem value="clear-all">✕ Limpar</SelectItem>
                )}
                {cidades
                  .filter(
                    (cidadeItem: any) =>
                      cidadeItem &&
                      cidadeItem !== "null" &&
                      (selectedEstados.length === 0 || 
                       selectedEstados.some(estadoSlug => {
                         const estado = estados.find(e => slugifyString(e.nome) === estadoSlug);
                         return estado && cidadeItem.estado?.nome === estado.nome;
                       }))
                  )
                  .map((cidadeItem: any) => (
                    <SelectItem key={cidadeItem.nome} value={cidadeItem.nome}>
                      {selectedCidades.includes(slugifyString(cidadeItem.nome)) ? "✓ " : ""}
                      {cidadeItem.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Bairros - Múltipla seleção */}
            <Select 
              value="" 
              open={bairrosOpen}
              onOpenChange={(open) => {
                // Só permite abrir se tiver cidades selecionadas
                if (open && selectedCidades.length === 0) {
                  alert("Por favor, selecione uma cidade primeiro");
                  return;
                }
                setBairrosOpen(open);
              }}
              onValueChange={(value) => {
                if (value === "clear-all") {
                  setSelectedBairros([]);
                  setBairrosOpen(false);
                } else {
                  const bairroSlug = slugifyString(value);
                  if (selectedBairros.includes(bairroSlug)) {
                    setSelectedBairros(selectedBairros.filter(b => b !== bairroSlug));
                  } else {
                    setSelectedBairros([...selectedBairros, bairroSlug]);
                  }
                  setBairrosOpen(true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedBairros.length > 0 ? `${selectedBairros.length} selecionado(s)` : "Bairros"} />
              </SelectTrigger>
              <SelectContent className="select-content">
                {selectedBairros.length > 0 && (
                  <SelectItem value="clear-all">✕ Limpar</SelectItem>
                )}
                {selectedCidades.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    Por favor, selecione uma cidade primeiro para ver a lista de
                    bairros disponíveis.
                  </p>
                ) : filteredDistricts.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    Não há bairros disponíveis para a cidade selecionada.
                  </p>
                ) : (
                  filteredDistricts
                    .filter((v: any) => v.bairro)
                    .map((bairroItem: any, index: number) => (
                      <SelectItem key={index} value={bairroItem.bairro || ""}>
                        {selectedBairros.includes(slugifyString(bairroItem.bairro || "")) ? "✓ " : ""}
                        {bairroItem.bairro}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>

            {/* Tipos - Múltipla seleção */}
            <Select 
              value=""
              open={tiposOpen}
              onOpenChange={setTiposOpen}
              onValueChange={(value) => {
                if (value === "clear-all") {
                  setSelectedTipos([]);
                  setTiposOpen(false);
                } else {
                  const tipoSlug = slugifyString(value);
                  if (selectedTipos.includes(tipoSlug)) {
                    setSelectedTipos(selectedTipos.filter(t => t !== tipoSlug));
                  } else {
                    setSelectedTipos([...selectedTipos, tipoSlug]);
                  }
                  setTiposOpen(true);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedTipos.length > 0 ? `${selectedTipos.length} selecionado(s)` : "Tipos"} />
              </SelectTrigger>
              <SelectContent className="select-content">
                {selectedTipos.length > 0 && (
                  <SelectItem value="clear-all">✕ Limpar</SelectItem>
                )}
                {tiposOptions.map((tipoItem, index) => {
                  const tipoValue = typeof tipoItem === "string" ? tipoItem : tipoItem.tipo || tipoItem.nome;
                  return (
                    <SelectItem key={index} value={tipoValue}>
                      {selectedTipos.includes(slugifyString(tipoValue)) ? "✓ " : ""}
                      {tipoValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Campo de Código com Sugestões */}
            <div className="relative">
              <input
                type="text"
                placeholder="Código"
                className="w-full pl-2 pr-2 py-2 border rounded-xl outline-none"
                value={codigoInput}
                onChange={(e) => {
                  setCodigoInput(e.target.value);
                  setCodigo(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 100);
                }}
              />
              {showSuggestions && codigoSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1">
                  {codigoSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setCodigoInput(suggestion);
                        setCodigo(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="relative justify-between w-full md:w-[80%] md:mx-auto flex-col mt-3 *:w-full *:flex *:justify-between *:border-black *:border *:rounded-lg gap-3 *:py-2 *:px-3">
            <label>
              Valor mínimo
              <input
                placeholder="R$0,00"
                className="outline-none w-16 placeholder:text-black"
                type="number"
                value={valorMin}
                onChange={(e) =>
                  setValorMin(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={0}
              />
            </label>
            <label>
              Valor máximo
              <input
                placeholder="R$0,00"
                className="outline-none w-16 placeholder:text-black"
                type="number"
                value={valorMax}
                onChange={(e) =>
                  setValorMax(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={0}
              />
            </label>
          </div>
        </div>
      </motion.div>
    </form>
  );
};

export default PropertiesFilter;