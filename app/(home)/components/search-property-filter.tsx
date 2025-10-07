"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
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
    opacity: "var(--opacity-to, 1)",
  },
};

type FormProps = {
  className?: string;
  cidades: any[];
  estados: any[];
  bairros: any[];
  codigos: string[];
  tipos?: any[];
  caracteristicas?: any[];
  searchParams: any;
};

const SearchPropertyFilter = ({
  className,
  cidades,
  estados,
  bairros,
  codigos,
  tipos = [],
  caracteristicas = [],
  searchParams,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transacao, setTransacao] = useState<string>(
    searchParams?.transacao ?? ""
  );
  
  // Estados para múltipla seleção
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [selectedCidades, setSelectedCidades] = useState<string[]>([]);
  const [selectedBairros, setSelectedBairros] = useState<string[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);
  
  const [codigo, setCodigo] = useState<string>(searchParams?.codigo ?? "");
  const [codigoInput, setCodigoInput] = useState<string>(
    searchParams?.codigo ?? ""
  );
  const [codigoSuggestions, setCodigoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [valorMin, setValorMin] = useState<number | "">(
    searchParams?.valorMin ?? ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.valorMax ?? ""
  );
  const router = useRouter();

  const [condominio, setCondominio] = useState<string>("");
  const [dormitorios, setDormitorios] = useState<string>("");
  const [vagas, setVagas] = useState<string>("");

  const inputRef = useRef<HTMLFormElement | null>(null);

  const [filteredDistricts, setFilteredDistricts] = useState(bairros);
  
  // Função para slugificar strings
  const slugifyOptions = {
    lower: true,
    strict: true,
    locale: "pt",
    remove: /[*+~.()'"!:@]/g,
  };

  const slugifyString = (str: string) => slugify(str, slugifyOptions);

  // Atualizar bairros quando cidades mudarem
  useEffect(() => {
    if (selectedCidades.length > 0) {
      // Filtrar bairros baseado nas cidades selecionadas
      const bairrosFiltrados = (bairros ?? []).filter((bairro: any) => {
        const cidadeNome = bairro?.cidadeNome || "";
        return selectedCidades.some(cidadeSlug => {
          const cidade = cidades.find(c => slugifyString(c.nome) === cidadeSlug);
          return cidade && cidadeNome.toLowerCase() === cidade.nome.toLowerCase();
        });
      });
      setFilteredDistricts(bairrosFiltrados);
    } else {
      setFilteredDistricts(bairros);
    }
  }, [selectedCidades, bairros, cidades]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const clickedInsideInput = inputRef.current?.contains(target);
      const clickedInsideSelectContent = target.closest(".select-content");

      if (!clickedInsideInput && !clickedInsideSelectContent) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir segmentos de URL baseados nos nomes selecionados com prefixos
    const urlSegments = [];

    if (transacao) urlSegments.push(`transacao-${slugifyString(transacao)}`);
    if (selectedEstados.length > 0) {
      urlSegments.push(`estado-${selectedEstados.join(",")}`);
    }
    if (selectedCidades.length > 0) {
      urlSegments.push(`cidade-${selectedCidades.join(",")}`);
    }
    if (selectedBairros.length > 0) {
      urlSegments.push(`bairro-${selectedBairros.join(",")}`);
    }
    if (selectedTipos.length > 0) {
      urlSegments.push(`tipo-${selectedTipos.join(",")}`);
    }
    if (dormitorios)
      urlSegments.push(`dormitorios-${slugifyString(dormitorios)}`);
    if (vagas) urlSegments.push(`vagas-${slugifyString(vagas)}`);
    if (valorMin)
      urlSegments.push(`preco-min-${slugifyString(String(valorMin))}`);
    if (valorMax)
      urlSegments.push(`preco-max-${slugifyString(String(valorMax))}`);
    if (codigo) urlSegments.push(`codigo-${slugifyString(codigo)}`);
    if (searchParams?.pagina) {
      urlSegments.push(`pagina-${searchParams.pagina}`);
    }
    
    // Construir a URL final
    const url = `/imoveis/${urlSegments.join("/")}`;

    console.log("URL construída:", url);

    // Navegar para a URL construída
    router.push(url);
  };

  const getSelectedFilters = () => {
    const filters: string[] = [];

    if (transacao) {
      filters.push(transacao);
    }
    if (selectedEstados.length > 0) {
      filters.push(`${selectedEstados.length} estado(s)`);
    }
    if (selectedCidades.length > 0) {
      filters.push(`${selectedCidades.length} cidade(s)`);
    }
    if (selectedBairros.length > 0) {
      filters.push(`${selectedBairros.length} bairro(s)`);
    }
    if (selectedTipos.length > 0) {
      filters.push(`${selectedTipos.length} tipo(s)`);
    }
    if (codigo) {
      filters.push(codigo);
    }
    if (valorMin !== "") {
      filters.push(`R$${valorMin.toLocaleString("pt-BR")}`);
    }
    if (valorMax !== "") {
      filters.push(`R$${valorMax.toLocaleString("pt-BR")}`);
    }
    if (condominio) {
      filters.push(condominio);
    }
    if (dormitorios) {
      filters.push(`${dormitorios} Dormitório(s)`);
    }
    if (vagas) {
      filters.push(`${vagas} Vaga(s)`);
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
    if (codigoInput && typeof codigoInput === 'string') {
      const filtered = codigos.filter((codigoItem) =>
        typeof codigoItem === 'string' && codigoItem.toLowerCase().includes(codigoInput.toLowerCase())
      );
      setCodigoSuggestions(filtered);
    } else {
      setCodigoSuggestions([]);
    }
  }, [codigoInput, codigos]);

  // Estados para controlar se os selects permanecem abertos
  const [estadosOpen, setEstadosOpen] = useState(false);
  const [cidadesOpen, setCidadesOpen] = useState(false);
  const [bairrosOpen, setBairrosOpen] = useState(false);
  const [tiposOpen, setTiposOpen] = useState(false);

  return (
    <form
      className={cn(
        "group w-[min(100%,62.5rem)] bg-white py-3 px-3 md:py-4 md:px-5 rounded-[.625rem]",
        className
      )}
      ref={inputRef}
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-full md:flex-1 pl-8 sm:pl-10 md:pl-12 bg-hero-input bg-[size:1.5rem] sm:bg-[size:auto] bg-no-repeat bg-left placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none truncate"
          onClick={toggleMenu}
          readOnly
          value={getSelectedFilters()}
        />
        <button
          type="submit"
          className="bg-[#2a2b2f] flex-shrink-0 text-[.75rem] md:text-sm py-2 px-4 md:px-6 rounded-lg"
        >
          Buscar imóveis
        </button>
      </div>
      <motion.div
        className="bg-white [--display-from:none] [--display-to:block] md:[--display-to:flex] [--opacity-from:0] [--opacity-to:80%] *:text-black *:font-semibold absolute py-4 px-5 w-full bottom-0 translate-y-full left-0 md:gap-3 rounded-[.625rem] *:flex *:flex-wrap md:*:flex-nowrap *:justify-center md:*:justify-between *:items-center"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div className="md:w-[55%] *:w-[10.5rem] gap-2 *:rounded-xl *:border-black *:border">
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
            onOpenChange={setBairrosOpen}
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
            disabled={selectedCidades.length === 0}
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
              className="w-full pl-2 pr-2 py-2 border rounded-lg outline-none"
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

        {/* Campos de Valor Mínimo e Máximo */}
        <div className="relative justify-between w-full flex-col mt-3 md:mt-0 *:w-full *:flex *:justify-between *:border-black *:border *:rounded-lg md:flex-row *:text-sm gap-3 *:py-2 *:px-3 lg:before:bg-black lg:before:h-full lg:before:absolute lg:before:w-[1px]">
          <label className="md:ml-4">
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
      </motion.div>
    </form>
  );
};

export default SearchPropertyFilter;