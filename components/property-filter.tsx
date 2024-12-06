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

type FormProps = {
  className?: string;
  estados: any[];
  cidades: any[];
  bairros: any[];
  codigos: string[];
  searchParams: any;
};

const SearchPropertyFilter = ({
  className,
  estados,
  cidades,
  bairros,
  codigos,
  searchParams,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [estado, setEstado] = useState<string>(searchParams?.estado ?? "");
  const [cidade, setCidade] = useState<string>(searchParams?.cidade ?? "");
  const [bairro, setBairro] = useState<string>(searchParams?.bairro ?? "");
  const [tipo, setTipo] = useState<string>(searchParams?.tipo ?? "");
  const [codigo, setCodigo] = useState<string>(searchParams?.codigo ?? "");
  const [codigoInput, setCodigoInput] = useState<string>(
    searchParams?.codigo ?? ""
  );
  const [codigoSuggestions, setCodigoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [valorMin, setValorMin] = useState<number | "">(
    searchParams?.["imovel.preco_min"] ?? ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.["imovel.preco_max"] ?? ""
  );

  const router = useRouter();

  const inputRef = useRef<HTMLFormElement | null>(null);

  const [filteredDistricts, setFilteredDistricts] = useState(bairros);
  useEffect(() => {
    setFilteredDistricts(
      (bairros ?? []).filter(
        (bairro: any) =>
          (bairro?.cidadeNome ?? "").toLowerCase() === cidade.toLowerCase()
      )
    );
  }, [cidade, bairros]);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Opções para slugify
    const slugifyOptions = {
      lower: true, // Converte para minúsculas
      strict: true, // Remove caracteres especiais
      locale: "pt", // Define o locale para português
      remove: /[*+~.()'"!:@]/g, // Remove caracteres adicionais
    };

    // Função auxiliar para slugificar
    const slugifyString = (str: string) => slugify(str, slugifyOptions);

    // Construir segmentos de URL baseados nos nomes selecionados com prefixos
    const urlSegments = [];

    if (estado) urlSegments.push(`estado-${slugifyString(estado)}`);
    if (cidade) urlSegments.push(`cidade-${slugifyString(cidade)}`);
    if (bairro) urlSegments.push(`bairro-${slugifyString(bairro)}`);
    if (tipo) urlSegments.push(`tipo-${slugifyString(tipo)}`);
    if (valorMin)
      urlSegments.push(`preco-min-${slugifyString(String(valorMin))}`);
    if (valorMax)
      urlSegments.push(`preco-max-${slugifyString(String(valorMax))}`);
    if (codigo) urlSegments.push(`codigo-${slugifyString(codigo)}`);

    // Construir a URL final
    const url = `/imoveis/${urlSegments.join("/")}`;
    // Aqui você pode incluir outros filtros ou query params, se necessário

    console.log("URL construída:", url);

    // Navegar para a URL construída
    router.push(url);
  };

  const getSelectedFilters = () => {
    const filters: string[] = [];

    if (estado) {
      filters.push(estado);
    }

    if (cidade) {
      filters.push(cidade);
    }

    if (bairro) {
      filters.push(bairro);
    }

    if (tipo) {
      filters.push(tipo);
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

    return filters.join(", ");
  };

  const tiposOptions = [
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
      ref={inputRef}
      onSubmit={handleSubmit}
      className={cn(
        "group w-full max-w-[71.875rem] bg-white py-3 px-3 rounded-[.625rem] mx-auto",
        className
      )}
    >
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-full sm:flex-1 pl-6 sm:pl-10 bg-hero-input bg-no-repeat bg-[size:1.25rem] sm:bg-[size:auto] bg-left placeholder:text-black placeholder:text-[.75rem] md:placeholder:text-base placeholder:italic text-black outline-none"
          onClick={toggleMenu}
          readOnly
          value={getSelectedFilters()}
        />
        <button
          type="submit"
          className="bg-[#2a2b2f] text-[.75rem] flex-shrink-0 py-2 px-4 lg:px-6 rounded-lg"
        >
          Buscar imóveis
        </button>
      </div>
      <motion.div
        className="bg-white max-w-[71.875rem] [--display-from:none] [--display-to:block] [--opacity-from:0] [--opacity-to:95%] *:text-black *:font-semibold z-50 absolute py-4 px-5 w-full bottom-0 left-1/2 -translate-x-1/2 translate-y-full md:gap-3 rounded-[.625rem]"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div className="max-w-[37.5rem] px-3 mx-auto *:flex *:flex-wrap *:justify-center *:items-center">
          <div className="*:w-[10.5rem] gap-4 *:rounded-xl *:border-black *:border">
            <Select
              value={estado}
              onValueChange={(value) => {
                setEstado(value);
                setCidade("");
                setBairro("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estados" />
              </SelectTrigger>
              <SelectContent className="select-content">
                {estados
                  .filter((estadoItem: any) => estadoItem.sigla !== "PA")
                  .map((estadoItem) => (
                    <SelectItem key={estadoItem.nome} value={estadoItem.nome}>
                      {estadoItem.sigla}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Seleção de Cidades */}
            <Select
              value={cidade}
              onValueChange={(value) => {
                setCidade(value);
                setBairro("");
              }}
              disabled={!estado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cidades" />
              </SelectTrigger>
              <SelectContent className="select-content">
                {cidades
                  .filter(
                    (cidadeItem: any) =>
                      cidadeItem &&
                      cidadeItem !== "null" &&
                      cidadeItem.estado?.nome === estado
                  )
                  .map((cidadeItem: any) => (
                    <SelectItem key={cidadeItem.nome} value={cidadeItem.nome}>
                      {cidadeItem.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Seleção de Bairros */}
            <Select value={bairro} onValueChange={setBairro} disabled={!cidade}>
              <SelectTrigger>
                <SelectValue placeholder="Bairros" />
              </SelectTrigger>
              <SelectContent className="select-content">
                {!cidade ? (
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
                    .map((bairro: any, index: number) => (
                      <SelectItem key={index} value={bairro.bairro || ""}>
                        {bairro.bairro}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>

            {/* Seleção de Tipos */}
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipos" />
              </SelectTrigger>
              <SelectContent className="select-content">
                {tiposOptions.map((tipoItem, index) => (
                  <SelectItem key={index} value={tipoItem}>
                    {tipoItem}
                  </SelectItem>
                ))}
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
          <div className="relative justify-between w-full md:w-[80%] md:mx-auto flex-col mt-3 *:w-full *:flex *:justify-between *:border-black *:border *:rounded-lg gap-3 *:py-2 *:px-3">
            <label>
              Valor mínimo
              <input
                placeholder="R$0,00"
                className="outline-none w-16 placeholder:text-black"
                type="number"
                value={valorMin}
                onChange={(e) =>
                  setValorMin(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
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
                  setValorMax(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
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

export default SearchPropertyFilter;
