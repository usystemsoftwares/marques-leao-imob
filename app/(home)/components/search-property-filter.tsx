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
  searchParams: any;
};

const SearchPropertyFilter = ({
  className,
  cidades,
  estados,
  bairros,
  codigos,
  searchParams,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transacao, setTransacao] = useState<string>(
    searchParams?.transacao ?? ""
  );
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
    searchParams?.valorMin ?? ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.valorMax ?? ""
  );
  const router = useRouter();

  const [condominio, setCondominio] = useState<string>(""); // Novo
  const [dormitorios, setDormitorios] = useState<string>(""); // Novo
  const [vagas, setVagas] = useState<string>(""); // Novo

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

  const handleSubmit = (e: React.FormEvent) => {
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

    if (transacao) urlSegments.push(`transacao-${slugifyString(transacao)}`);
    if (estado) urlSegments.push(`estado-${slugifyString(estado)}`);
    if (cidade) urlSegments.push(`cidade-${slugifyString(cidade)}`);
    if (bairro) urlSegments.push(`bairro-${slugifyString(bairro)}`);
    if (tipo) urlSegments.push(`tipo-${slugifyString(tipo)}`);
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
    // Aqui você pode incluir outros filtros ou query params, se necessário

    console.log("URL construída:", url);

    // Navegar para a URL construída
    router.push(url);
  };

  const getSelectedFilters = () => {
    const filters: string[] = [];

    if (transacao) {
      filters.push(transacao);
    }

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

    // Opcional: Incluir filtros adicionais no display
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
          className="w-full md:flex-1 pl-8 sm:pl-10 md:pl-12 bg-hero-input bg-[size:1.5rem] sm:bg-[size:auto] bg-no-repeat bg-left placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none"
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
                  <SelectItem
                    key={estadoItem.nome}
                    value={estadoItem.nome.toString()}
                  >
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
                  .map((bairroItem: any, index: number) => (
                    <SelectItem key={index} value={bairroItem.bairro || ""}>
                      {bairroItem.bairro}
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
