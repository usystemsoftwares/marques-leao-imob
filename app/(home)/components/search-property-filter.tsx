"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { getBairrosPorCidade } from "@/lib/api";
import { Hash } from "lucide-react";

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
  searchParams,
}: FormProps) => {
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [selectedCidades, setSelectedCidades] = useState<string[]>([]);
  const [selectedBairros, setSelectedBairros] = useState<string[]>([]);
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);

  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<any[]>([]);
  const [loadingBairros, setLoadingBairros] = useState(false);

  const [valorMin, setValorMin] = useState<number | "">("");
  const [valorMax, setValorMax] = useState<number | "">("");

  const [estadosOpen, setEstadosOpen] = useState(false);
  const [cidadesOpen, setCidadesOpen] = useState(false);
  const [bairrosOpen, setBairrosOpen] = useState(false);
  const [tiposOpen, setTiposOpen] = useState(false);

  const selectingEstados = useRef(false);
  const selectingCidades = useRef(false);
  const selectingBairros = useRef(false);
  const selectingTipos = useRef(false);

  const [showCodeSearch, setShowCodeSearch] = useState(false);
  const [propertyCode, setPropertyCode] = useState("");

  const router = useRouter();

  const slugifyOptions = {
    lower: true,
    strict: true,
    locale: "pt",
    remove: /[*+~.()'"!:@]/g,
  };
  const slugifyString = (str: string) => slugify(str, slugifyOptions);

  const formatValor = (v: number | ""): string => {
    if (v === "") return "";
    return `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
  };
  const parseValor = (raw: string): number | "" => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits);
  };

  const bairrosToUse = selectedCidades.length > 0 ? filteredNeighborhoods : [];

  useEffect(() => {
    const load = async () => {
      if (selectedCidades.length === 0) {
        setFilteredNeighborhoods([]);
        setSelectedBairros([]);
        return;
      }
      setLoadingBairros(true);
      try {
        const cidadesIds: string[] = [];
        selectedCidades.forEach((slug) => {
          const cidade = cidades.find((c) => slugifyString(c.nome) === slug);
          if (cidade?.id) cidadesIds.push(cidade.id);
        });
        if (cidadesIds.length > 0) {
          const results = await Promise.all(
            cidadesIds.map((id) => getBairrosPorCidade(id))
          );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlSegments: string[] = [];
    if (selectedEstados.length > 0)
      urlSegments.push(`estado-${selectedEstados.join(",")}`);
    if (selectedCidades.length > 0)
      urlSegments.push(`cidade-${selectedCidades.join(",")}`);
    if (selectedBairros.length > 0)
      urlSegments.push(`bairro-${selectedBairros.join(",")}`);
    if (selectedTipos.length > 0)
      urlSegments.push(`tipo-${selectedTipos.join(",")}`);
    if (valorMin !== "") urlSegments.push(`preco-min-${valorMin}`);
    if (valorMax !== "") urlSegments.push(`preco-max-${valorMax}`);
    router.push(`/imoveis/${urlSegments.join("/")}`);
  };

  const tiposOptions =
    tipos.length > 0
      ? tipos
      : [
          "Apartamento",
          "Casa",
          "Casa em Condomínio",
          "Cobertura",
          "Terreno",
          "Terreno em Condomínio",
        ];

  return (
    <form
      className={cn(
        // ── Mobile: card estilo hauz ──────────────────────────────────────
        "w-[min(calc(100%-2rem),26rem)] mx-auto rounded-2xl p-5 shadow-2xl backdrop-blur-sm",
        "[background:linear-gradient(135deg,rgba(83,9,68,0.88)_0%,rgba(8,8,15,0.85)_100%)]",
        // ── Desktop: barra branca horizontal ─────────────────────────────
        "md:[background:white] md:w-[min(100%,62.5rem)] md:rounded-[.625rem] md:shadow-md",
        "md:py-3 md:px-4 md:flex md:items-center md:gap-2",
        className
      )}
      onSubmit={handleSubmit}
    >
      {/*
        MOBILE  → grid 2 colunas (div é um container grid)
        DESKTOP → md:contents faz o div "desaparecer" do layout e os filhos
                  entram diretamente no flex do <form>
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
                prev.includes(slug)
                  ? prev.filter((e) => e !== slug)
                  : [...prev, slug]
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
              <SelectItem value="clear-all" className="text-red-600">
                ✕ Limpar
              </SelectItem>
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
                prev.includes(slug)
                  ? prev.filter((c) => c !== slug)
                  : [...prev, slug]
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
              <SelectItem value="clear-all" className="text-red-600">
                ✕ Limpar
              </SelectItem>
            )}
            {cidades
              .filter(
                (c: any) =>
                  c &&
                  c !== "null" &&
                  (selectedEstados.length === 0 ||
                    selectedEstados.some((slug) => {
                      const est = estados.find(
                        (e) => slugifyString(e.nome) === slug
                      );
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
                prev.includes(value)
                  ? prev.filter((b) => b !== value)
                  : [...prev, value]
              );
            }
          }}
          disabled={selectedCidades.length === 0}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[5.5rem]">
            <SelectValue
              placeholder={
                selectedCidades.length === 0
                  ? "Bairros"
                  : loadingBairros
                  ? "Carregando..."
                  : selectedBairros.length > 0
                  ? `${selectedBairros.length} bairro(s)`
                  : "Bairros"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedBairros.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">
                ✕ Limpar
              </SelectItem>
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

        {/* Tipo do imóvel */}
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
                prev.includes(slug)
                  ? prev.filter((t) => t !== slug)
                  : [...prev, slug]
              );
            }
          }}
        >
          <SelectTrigger className="bg-white border-0 h-11 text-gray-700 text-sm md:h-9 md:border md:border-gray-300 md:rounded-lg md:text-black md:text-xs md:min-w-[6rem]">
            <SelectValue
              placeholder={
                selectedTipos.length > 0
                  ? `${selectedTipos.length} tipo(s)`
                  : "Tipos"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {selectedTipos.length > 0 && (
              <SelectItem value="clear-all" className="text-red-600">
                ✕ Limpar
              </SelectItem>
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

        {/* Separador vertical — apenas desktop, entre tipos e valores */}
        <div className="hidden md:block h-7 w-px bg-gray-300 shrink-0 self-center" />

        {/* Valor Mínimo */}
        <div className="bg-white rounded-md h-11 flex items-center px-3 md:h-9 md:rounded-lg md:border md:border-gray-300 md:px-2 md:min-w-[8rem]">
          <input
            placeholder="Valor mínimo"
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent md:text-xs md:placeholder:text-gray-400"
            type="text"
            inputMode="numeric"
            value={formatValor(valorMin)}
            onChange={(e) => setValorMin(parseValor(e.target.value))}
          />
        </div>

        {/* Valor Máximo */}
        <div className="bg-white rounded-md h-11 flex items-center px-3 md:h-9 md:rounded-lg md:border md:border-gray-300 md:px-2 md:min-w-[8rem]">
          <input
            placeholder="Valor máximo"
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent md:text-xs md:placeholder:text-gray-400"
            type="text"
            inputMode="numeric"
            value={formatValor(valorMax)}
            onChange={(e) => setValorMax(parseValor(e.target.value))}
          />
        </div>

        {/* Separador vertical — apenas desktop */}
        <div className="hidden md:block h-7 w-px bg-gray-300 shrink-0 self-center" />

        {/* Código — desktop inline, mobile toggle */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg h-9 flex items-center px-2 border border-gray-300 min-w-[7rem]">
            <input
              placeholder="Código"
              className="outline-none text-xs w-full text-black placeholder:text-gray-400 bg-transparent"
              type="text"
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && propertyCode.trim()) {
                  e.preventDefault();
                  router.push(`/imovel/${propertyCode.trim()}`);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Buscar
          Mobile  → botão branco full-width
          Desktop → botão escuro auto-width no final da barra */}
      <button
        type="submit"
        className={cn(
          "w-full bg-white text-[#530944] font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors text-base",
          "md:w-auto md:flex-shrink-0 md:bg-[#2a2b2f] md:text-white md:rounded-lg md:py-2 md:px-5 md:text-sm md:hover:bg-black"
        )}
      >
        Buscar imóveis
      </button>

      {/* Busca por Código — apenas mobile */}
      <div className="md:hidden mt-3">
        <button
          type="button"
          onClick={() => setShowCodeSearch(!showCodeSearch)}
          className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm py-2 transition-colors"
        >
          <Hash className="w-4 h-4" />
          Buscar por Código
        </button>

        {showCodeSearch && (
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Digite o código do imóvel"
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && propertyCode.trim()) {
                  router.push(`/imovel/${propertyCode.trim()}`);
                }
              }}
              className="w-full h-11 px-4 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (propertyCode.trim()) {
                  router.push(`/imovel/${propertyCode.trim()}`);
                }
              }}
              className="w-full bg-[#530944] text-white font-semibold py-3 rounded-xl hover:bg-[#6b0b58] transition-colors text-sm"
            >
              Buscar por Código
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchPropertyFilter;
