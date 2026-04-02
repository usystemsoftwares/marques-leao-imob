"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getBairrosPorCidade } from "@/lib/api";
import { slugifyString } from "@/utils/slugify";

type FormProps = {
  className?: string;
  estados: any[];
  cidades: any[];
  bairros: any[];
  tipos: any[];
  codigos: string[];
  searchParams: any;
  sortSlot?: React.ReactNode;
};

const PropertiesFilter = ({
  className,
  estados,
  cidades,
  bairros,
  tipos,
  codigos,
  searchParams,
  sortSlot,
}: FormProps) => {
  const router = useRouter();

  // Função para obter valores iniciais como array
  const getInitialArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.includes(","))
      return value.split(",").map((v) => v.trim());
    return [value];
  };

  // Estados múltiplos
  const [selectedEstados, setSelectedEstados] = useState<string[]>(() =>
    getInitialArray(searchParams?.estado).map((v) => {
      const est = estados.find(
        (e) => e.nome === v || slugifyString(e.nome) === v
      );
      return est ? slugifyString(est.nome) : v;
    })
  );

  const [selectedCidades, setSelectedCidades] = useState<string[]>(() =>
    getInitialArray(searchParams?.cidade).map((v) => {
      const cid = cidades.find(
        (c) => c.nome === v || slugifyString(c.nome) === v
      );
      return cid ? slugifyString(cid.nome) : v;
    })
  );

  const [selectedBairros, setSelectedBairros] = useState<string[]>(() =>
    getInitialArray(searchParams?.bairro).map((v) => {
      const b = bairros.find((b) => {
        const nome = b.bairro || b.nome || b;
        return nome === v || slugifyString(nome) === v;
      });
      return b ? slugifyString(b.bairro || b.nome || b) : v;
    })
  );

  const [selectedTipos, setSelectedTipos] = useState<string[]>(() =>
    getInitialArray(searchParams?.tipo).map((v) => {
      const t = tipos.find((t) => {
        const val = typeof t === "string" ? t : t.tipo || t.nome;
        return val === v || slugifyString(val) === slugifyString(v);
      });
      const val = t ? (typeof t === "string" ? t : t.tipo || t.nome) : v;
      return slugifyString(val);
    })
  );

  // Bairros filtrados por cidade (carregados dinamicamente)
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<any[]>([]);
  const [loadingBairros, setLoadingBairros] = useState(false);
  // Quando não há cidade selecionada mas há bairros (vindos da URL/mapa),
  // exibe esses bairros no dropdown para permitir visualizar/remover a seleção
  const bairrosToUse =
    selectedCidades.length > 0
      ? filteredNeighborhoods
      : selectedBairros.map((slug) => {
        const found = bairros.find((b: any) => {
          const nome = b.bairro || b.nome || (typeof b === "string" ? b : "");
          return slugifyString(nome) === slug;
        });
        const nome = found
          ? found.bairro || found.nome || found
          : slug;
        return { bairro: nome, nome };
      });

  useEffect(() => {
    const load = async () => {
      if (selectedCidades.length === 0) {
        setFilteredNeighborhoods([]);
        // Não limpar selectedBairros — podem vir da URL (clique no mapa)
        return;
      }
      setLoadingBairros(true);
      try {
        const ids: string[] = [];
        selectedCidades.forEach((slug) => {
          const cid = cidades.find((c) => slugifyString(c.nome) === slug);
          if (cid?.id) ids.push(cid.id);
        });
        if (ids.length > 0) {
          const results = await Promise.all(ids.map((id) => getBairrosPorCidade(id)));
          const unicos = [...new Set(results.flat())];
          setFilteredNeighborhoods(
            unicos
              .filter((b) => b && typeof b === "string")
              .map((b) => ({ bairro: b, nome: b }))
          );
        } else {
          setFilteredNeighborhoods([]);
        }
      } catch {
        setFilteredNeighborhoods([]);
      } finally {
        setLoadingBairros(false);
      }
    };
    load();
  }, [selectedCidades, cidades]);

  // Código com autocomplete
  const [codigo, setCodigo] = useState<string>(() => {
    const val = searchParams?.codigo || searchParams?.codigos || "";
    return Array.isArray(val) ? val[0] || "" : String(val);
  });
  const [codigoInput, setCodigoInput] = useState<string>(() => {
    const val = searchParams?.codigo || searchParams?.codigos || "";
    return Array.isArray(val) ? val[0] || "" : String(val);
  });
  const [codigoSuggestions, setCodigoSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (codigoInput) {
      setCodigoSuggestions(
        codigos.filter(
          (c) =>
            typeof c === "string" &&
            c.toLowerCase().includes(codigoInput.toLowerCase())
        )
      );
    } else {
      setCodigoSuggestions([]);
    }
  }, [codigoInput, codigos]);

  // Preço
  const [valorMin, setValorMin] = useState<number | "">(
    searchParams?.preco_min || searchParams?.["preco-min"] ? Number(searchParams.preco_min || searchParams?.["preco-min"]) : ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.preco_max || searchParams?.["preco-max"] ? Number(searchParams.preco_max || searchParams?.["preco-max"]) : ""
  );

  const formatValor = (v: number | ""): string => {
    if (v === "") return "";
    return `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
  };
  const parseValor = (raw: string): number | "" => {
    const digits = raw.replace(/\D/g, "");
    return digits ? Number(digits) : "";
  };

  // Controle de abertura dos selects (mantém aberto em múltipla seleção)
  const [estadosOpen, setEstadosOpen] = useState(false);
  const [cidadesOpen, setCidadesOpen] = useState(false);
  const [bairrosOpen, setBairrosOpen] = useState(false);
  const [tiposOpen, setTiposOpen] = useState(false);

  // Refs para impedir fechamento prematuro no mobile (Radix dispara onOpenChange antes de onValueChange)
  const selectingEstados = useRef(false);
  const selectingCidades = useRef(false);
  const selectingBairros = useRef(false);
  const selectingTipos = useRef(false);

  const tiposOptions = tipos.length > 0
    ? tipos
    : [
      "Apartamento",
      "Casa",
      "Casa em Condomínio",
      "Cobertura",
      "Terreno",
      "Terreno em Condomínio",
    ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const segs: string[] = [];
    if (selectedEstados.length > 0) segs.push(`estado-${selectedEstados.join(",")}`);
    if (selectedCidades.length > 0) segs.push(`cidade-${selectedCidades.join(",")}`);
    if (selectedBairros.length > 0) segs.push(`bairro-${selectedBairros.join(",")}`);
    if (selectedTipos.length > 0) segs.push(`tipo-${selectedTipos.join(",")}`);
    if (valorMin) segs.push(`preco-min-${valorMin}`);
    if (valorMax) segs.push(`preco-max-${valorMax}`);
    if (codigo) segs.push(`codigo-${codigo.trim()}`);
    router.push(segs.length > 0 ? `/imoveis/${segs.join("/")}` : `/imoveis`);
  };

  return (
    <form
      className={cn(
        // Mobile: card escuro (mesmo estilo do filtro da home)
        "w-[min(calc(100%-2rem),26rem)] mx-auto rounded-2xl p-5 shadow-2xl backdrop-blur-sm",
        "[background:linear-gradient(135deg,rgba(83,9,68,0.88)_0%,rgba(8,8,15,0.85)_100%)]",
        // Desktop: barra branca horizontal com largura máxima
        "md:[background:white] md:w-[min(100%,72rem)] md:rounded-[.625rem] md:shadow-md",
        "md:py-3 md:px-4 md:flex md:items-center md:gap-2",
        className
      )}
      onSubmit={handleSubmit}
    >
      {/*
        MOBILE  → grid 1 coluna
        DESKTOP → md:contents faz o div desaparecer e os filhos entram
                  diretamente no flex do <form>
      */}
      <div className="grid grid-cols-1 gap-3 mb-3 md:contents">

        {/* Estado */}
        <Select
          value=""
          open={estadosOpen}
          onOpenChange={(open) => {
            if (!open && selectingEstados.current) {
              selectingEstados.current = false;
              return;
            }
            selectingEstados.current = false;
            setEstadosOpen(open);
          }}
          onValueChange={(value) => {
            if (value === "clear-all") {
              setSelectedEstados([]);
              setEstadosOpen(false);
            } else {
              selectingEstados.current = true;
              const slug = slugifyString(value);
              setSelectedEstados((prev) =>
                prev.includes(slug) ? prev.filter((e) => e !== slug) : [...prev, slug]
              );
            }
          }}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[5.5rem]">
            <SelectValue
              placeholder={
                selectedEstados.length > 0
                  ? `${selectedEstados.length} estado(s)`
                  : "Estado"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedEstados.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">✕ Limpar</SelectItem>
            )}
            {estados
              .filter((e: any) => e.sigla !== "PA")
              .sort((a: any, b: any) => {
                if (a.sigla === "RS") return -1;
                if (b.sigla === "RS") return 1;
                return a.sigla.localeCompare(b.sigla);
              })
              .map((e: any) => (
                <SelectItem key={e.nome} value={e.nome}>
                  {selectedEstados.includes(slugifyString(e.nome)) ? "✓ " : ""}
                  {e.sigla}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Cidade */}
        <Select
          value=""
          open={cidadesOpen}
          onOpenChange={(open) => {
            if (!open && selectingCidades.current) {
              selectingCidades.current = false;
              return;
            }
            selectingCidades.current = false;
            setCidadesOpen(open);
          }}
          onValueChange={(value) => {
            if (value === "clear-all") {
              setSelectedCidades([]);
              setCidadesOpen(false);
            } else {
              selectingCidades.current = true;
              const slug = slugifyString(value);
              setSelectedCidades((prev) =>
                prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
              );
            }
          }}
          disabled={selectedEstados.length === 0}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[5.5rem]">
            <SelectValue
              placeholder={
                selectedCidades.length > 0
                  ? `${selectedCidades.length} cidade(s)`
                  : "Cidades"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedCidades.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">✕ Limpar</SelectItem>
            )}
            {cidades
              .filter(
                (c: any) =>
                  c &&
                  c !== "null" &&
                  (selectedEstados.length === 0 ||
                    selectedEstados.some((slug) => {
                      const est = estados.find((e) => slugifyString(e.nome) === slug);
                      return est && c.estado?.nome === est.nome;
                    }))
              )
              .map((c: any) => (
                <SelectItem key={c.nome} value={c.nome}>
                  {selectedCidades.includes(slugifyString(c.nome)) ? "✓ " : ""}
                  {c.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Bairros */}
        <Select
          value=""
          open={bairrosOpen}
          onOpenChange={(open) => {
            if (!open && selectingBairros.current) {
              selectingBairros.current = false;
              return;
            }
            selectingBairros.current = false;
            setBairrosOpen(open);
          }}
          onValueChange={(value) => {
            if (value === "clear-all") {
              setSelectedBairros([]);
              setBairrosOpen(false);
            } else {
              selectingBairros.current = true;
              setSelectedBairros((prev) =>
                prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
              );
            }
          }}
          disabled={selectedCidades.length === 0 && selectedBairros.length === 0}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[5.5rem]">
            <SelectValue
              placeholder={
                selectedBairros.length > 0
                  ? `${selectedBairros.length} bairro(s)`
                  : selectedCidades.length === 0
                    ? "Bairros"
                    : loadingBairros
                      ? "Carregando..."
                      : "Bairros"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedBairros.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">✕ Limpar</SelectItem>
            )}
            {bairrosToUse.map((b: any) => {
              const slug = slugifyString(b.bairro);
              return (
                <SelectItem key={slug} value={slug}>
                  {selectedBairros.includes(slug) ? "✓ " : ""}
                  {b.bairro}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Tipo */}
        <Select
          value=""
          open={tiposOpen}
          onOpenChange={(open) => {
            if (!open && selectingTipos.current) {
              selectingTipos.current = false;
              return;
            }
            selectingTipos.current = false;
            setTiposOpen(open);
          }}
          onValueChange={(value) => {
            if (value === "clear-all") {
              setSelectedTipos([]);
              setTiposOpen(false);
            } else {
              selectingTipos.current = true;
              const slug = slugifyString(value);
              setSelectedTipos((prev) =>
                prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
              );
            }
          }}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[6rem]">
            <SelectValue
              placeholder={
                selectedTipos.length > 0 ? `${selectedTipos.length} tipo(s)` : "Tipos"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedTipos.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">✕ Limpar</SelectItem>
            )}
            {tiposOptions.map((t: any, i: number) => {
              const v = typeof t === "string" ? t : t.tipo || t.nome;
              return (
                <SelectItem key={i} value={v}>
                  {selectedTipos.includes(slugifyString(v)) ? "✓ " : ""}
                  {v}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Separador vertical — apenas desktop */}
        <div className="hidden md:block h-7 w-px bg-gray-300 shrink-0 self-center" />

        {/* Valor mínimo */}
        <div className="bg-white rounded-md h-11 flex items-center px-3 col-span-1 md:h-9 md:rounded-lg md:border md:border-gray-300 md:px-2 md:min-w-[8rem]">
          <input
            placeholder="Valor mínimo"
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent md:text-xs"
            type="text"
            inputMode="numeric"
            value={formatValor(valorMin)}
            onChange={(e) => setValorMin(parseValor(e.target.value))}
          />
        </div>

        {/* Valor máximo */}
        <div className="bg-white rounded-md h-11 flex items-center px-3 col-span-1 md:h-9 md:rounded-lg md:border md:border-gray-300 md:px-2 md:min-w-[8rem]">
          <input
            placeholder="Valor máximo"
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent md:text-xs"
            type="text"
            inputMode="numeric"
            value={formatValor(valorMax)}
            onChange={(e) => setValorMax(parseValor(e.target.value))}
          />
        </div>

        {/* Separador vertical — apenas desktop */}
        <div className="hidden md:block h-7 w-px bg-gray-300 shrink-0 self-center" />

        {/* Código com autocomplete */}
        <div className="relative">
          <div className="bg-white rounded-md h-11 flex items-center px-3 border border-gray-200 md:h-9 md:rounded-lg md:border md:border-gray-300 md:px-2 md:min-w-[7rem]">
            <input
              placeholder="Código"
              className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent md:text-xs"
              type="text"
              value={codigoInput}
              onChange={(e) => {
                setCodigoInput(e.target.value);
                setCodigo(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
            />
          </div>
          {showSuggestions && codigoSuggestions.length > 0 && (
            <ul className="absolute z-[300] w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1 shadow-lg">
              {codigoSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCodigoInput(s);
                    setCodigo(s);
                    setShowSuggestions(false);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Botão buscar
          Mobile  → full-width roxo
          Desktop → botão escuro compacto no final da barra */}
      <button
        type="submit"
        className={cn(
          "w-full bg-[#530944] text-white font-semibold py-3 rounded-xl hover:bg-[#3d0633] transition-colors text-base",
          "md:w-auto md:flex-shrink-0 md:bg-[#2a2b2f] md:rounded-lg md:py-2 md:px-5 md:text-sm md:hover:bg-black"
        )}
      >
        Buscar imóveis
      </button>

      {sortSlot && (
        <>
          <div className="hidden md:block h-7 w-px bg-gray-300 shrink-0 self-center" />
          {sortSlot}
        </>
      )}
    </form>
  );
};

export default PropertiesFilter;
