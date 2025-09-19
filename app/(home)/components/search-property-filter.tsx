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

  const [condominio, setCondominio] = useState<string>("");
  const [dormitorios, setDormitorios] = useState<string>("");
  const [vagas, setVagas] = useState<string>("");

  const inputRef = useRef<HTMLFormElement | null>(null);

  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  
  // Adicionar bairro "Centro" manualmente se estiver faltando
  const [bairrosCompletos, setBairrosCompletos] = useState<any[]>(bairros);

  useEffect(() => {
    // Verifica se o bairro "Centro" já existe para Novo Hamburgo
    const centroExists = bairros.some(b => 
      b.bairro === 'Centro' && b.cidadeNome === 'Novo Hamburgo'
    );
    
    if (!centroExists) {
      // Adiciona o bairro "Centro" para Novo Hamburgo
      setBairrosCompletos([
        ...bairros,
        {bairro: 'Centro', cidadeId: '4313409', cidadeNome: 'Novo Hamburgo'}
      ]);
    } else {
      setBairrosCompletos(bairros);
    }
  }, [bairros]);

  // Filtro de bairros corrigido
  useEffect(() => {
    if (!cidade) {
      setFilteredDistricts([]);
      return;
    }

    const filtered = (bairrosCompletos ?? []).filter((bairroItem: any) => {
      // Verifica múltiplas possibilidades de nome de cidade
      const cidadeBairro = bairroItem?.cidadeNome || bairroItem?.cidade?.nome || '';
      
      // Normaliza as strings para comparação (remove acentos e coloca em minúsculas)
      const normalizeString = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      };
      
      return normalizeString(cidadeBairro) === normalizeString(cidade);
    });
    
    setFilteredDistricts(filtered);
  }, [cidade, bairrosCompletos]);

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
      lower: true,
      strict: true,
      locale: "pt",
      remove: /[*+~.()'"!:@]/g,
    };

    const slugifyString = (str: string) => slugify(str, slugifyOptions);

    // Construir segmentos de URL
    const urlSegments = [];

    if (transacao) urlSegments.push(`transacao-${slugifyString(transacao)}`);
    if (estado) urlSegments.push(`estado-${slugifyString(estado)}`);
    if (cidade) urlSegments.push(`cidade-${slugifyString(cidade)}`);
    if (bairro) urlSegments.push(`bairro-${slugifyString(bairro)}`);
    if (tipo) urlSegments.push(`tipo-${slugifyString(tipo)}`);
    if (dormitorios) urlSegments.push(`dormitorios-${slugifyString(dormitorios)}`);
    if (vagas) urlSegments.push(`vagas-${slugifyString(vagas)}`);
    if (valorMin) urlSegments.push(`preco-min-${slugifyString(String(valorMin))}`);
    if (valorMax) urlSegments.push(`preco-max-${slugifyString(String(valorMax))}`);
    if (codigo) urlSegments.push(`codigo-${slugifyString(codigo)}`);
    if (searchParams?.pagina) {
      urlSegments.push(`pagina-${searchParams.pagina}`);
    }

    const url = `/imoveis/${urlSegments.join("/")}`;
    router.push(url);
  };

  const getSelectedFilters = () => {
    const filters: string[] = [];

    if (transacao) filters.push(transacao);
    if (estado) filters.push(estado);
    if (cidade) filters.push(cidade);
    if (bairro) filters.push(bairro);
    if (tipo) filters.push(tipo);
    if (codigo) filters.push(codigo);
    if (valorMin !== "") filters.push(`R$${valorMin.toLocaleString("pt-BR")}`);
    if (valorMax !== "") filters.push(`R$${valorMax.toLocaleString("pt-BR")}`);
    if (condominio) filters.push(condominio);
    if (dormitorios) filters.push(`${dormitorios} Dormitório(s)`);
    if (vagas) filters.push(`${vagas} Vaga(s)`);

    return filters.join(", ") || "Clique para iniciar sua busca";
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

  // Obter cidades filtradas por estado
  const filteredCities = estado
    ? cidades.filter(
        (cidadeItem: any) =>
          cidadeItem &&
          cidadeItem.estado?.nome === estado
      )
    : [];

  return (
    <form
      className={cn(
        "group w-[min(100%,62.5rem)] bg-white py-3 px-3 md:py-4 md:px-5 rounded-[.625rem] relative",
        className
      )}
      ref={inputRef}
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-full md:flex-1 pl-8 sm:pl-10 md:pl-12 bg-hero-input bg-[size:1.5rem] sm:bg-[size:auto] bg-no-repeat bg-left placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none cursor-pointer"
          onClick={toggleMenu}
          readOnly
          value={getSelectedFilters()}
        />
        <button
          type="submit"
          className="bg-[#2a2b2f] flex-shrink-0 text-[.75rem] md:text-sm py-2 px-4 md:px-6 rounded-lg text-white hover:bg-[#3a3b3f] transition-colors"
        >
          Buscar imóveis
        </button>
      </div>
      
      <motion.div
        className="bg-white [--display-from:none] [--display-to:block] md:[--display-to:flex] [--opacity-from:0] [--opacity-to:1] text-black font-semibold absolute py-4 px-5 w-full bottom-0 left-0 translate-y-full rounded-[.625rem] shadow-lg z-50 flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-3"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full md:w-[55%] flex flex-wrap gap-2">
          <div className="min-w-[10.5rem] rounded-xl border border-black">
            <Select
              value={estado}
              onValueChange={(value) => {
                setEstado(value);
                setCidade("");
                setBairro("");
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Estados" />
              </SelectTrigger>
              <SelectContent className="select-content max-h-60">
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
          </div>

          {/* Seleção de Cidades */}
          <div className="min-w-[10.5rem] rounded-xl border border-black">
            <Select
              value={cidade}
              onValueChange={(value) => {
                setCidade(value);
                setBairro("");
              }}
              disabled={!estado}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Cidades" />
              </SelectTrigger>
              <SelectContent className="select-content max-h-60">
                {filteredCities.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    {estado ? "Nenhuma cidade encontrada" : "Selecione um estado primeiro"}
                  </p>
                ) : (
                  filteredCities.map((cidadeItem: any) => (
                    <SelectItem key={cidadeItem.nome} value={cidadeItem.nome}>
                      {cidadeItem.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Bairros - CORRIGIDO */}
          <div className="min-w-[10.5rem] rounded-xl border border-black">
            <Select 
              value={bairro} 
              onValueChange={setBairro} 
              disabled={!cidade}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Bairros" />
              </SelectTrigger>
              <SelectContent className="select-content max-h-60">
                {!cidade ? (
                  <p className="px-4 py-2 text-gray-500">
                    Selecione uma cidade primeiro
                  </p>
                ) : filteredDistricts.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    Nenhum bairro encontrado para {cidade}
                  </p>
                ) : (
                  filteredDistricts
                    .filter((v: any) => v.bairro && v.bairro.trim() !== "")
                    .sort((a: any, b: any) => a.bairro.localeCompare(b.bairro))
                    .map((bairroItem: any, index: number) => (
                      <SelectItem 
                        key={`${bairroItem.bairro}-${index}`} 
                        value={bairroItem.bairro || ""}
                      >
                        {bairroItem.bairro}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Tipos */}
          <div className="min-w-[10.5rem] rounded-xl border border-black">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="h-10">
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
          </div>

          {/* Campo de Código com Sugestões */}
          <div className="min-w-[10.5rem] relative">
            <input
              type="text"
              placeholder="Código"
              className="w-full h-10 pl-3 pr-3 py-2 border border-black rounded-xl outline-none"
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
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1 shadow-md">
                {codigoSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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

        {/* Campos de Valor Mínimo e Máximo - CORRIGIDO */}
        <div className="w-full md:w-[40%] flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
          <div className="flex-1 flex justify-between items-center border border-black rounded-lg py-2 px-3">
            <span className="text-sm whitespace-nowrap">Valor mínimo</span>
            <input
              placeholder="R$ 0,00"
              className="outline-none w-20 placeholder:text-black text-right bg-transparent"
              type="number"
              value={valorMin}
              onChange={(e) =>
                setValorMin(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={0}
            />
          </div>
          
          <div className="flex-1 flex justify-between items-center border border-black rounded-lg py-2 px-3">
            <span className="text-sm whitespace-nowrap">Valor máximo</span>
            <input
              placeholder="R$ 0,00"
              className="outline-none w-20 placeholder:text-black text-right bg-transparent"
              type="number"
              value={valorMax}
              onChange={(e) =>
                setValorMax(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={0}
            />
          </div>
        </div>
      </motion.div>
    </form>
  );
};

export default SearchPropertyFilter;