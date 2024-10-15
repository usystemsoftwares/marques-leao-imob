"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cidade, Estado } from "smart-imob-types";
import Link from "next/link";

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
  estados: Estado[];
  cidades: Cidade[];
  bairros: any[];
  tipos: string[];
  codigos: string[];
  searchParams: any;
};

const SearchPropertyFilter = ({
  className,
  cidades,
  bairros,
  tipos,
  codigos,
  estados,
  searchParams,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [estado, setEstado] = useState<string>(searchParams?.estado_id ?? "");
  const [cidade, setCidade] = useState<string>(searchParams?.cidade_id ?? "");
  const [bairro, setBairro] = useState<string>(
    Array.isArray(searchParams?.bairros)
      ? searchParams.bairros[0]
      : searchParams?.bairros ?? ""
  );
  const [tipo, setTipo] = useState<string>(
    Array.isArray(searchParams?.tipos)
      ? searchParams.tipos[0]
      : searchParams?.tipos ?? ""
  );
  const [codigo, setCodigo] = useState<string>(searchParams?.código ?? "");
  const [valorMin, setValorMin] = useState<number | "">(
    searchParams?.['imovel.preco_min'] ?? ""
  );
  const [valorMax, setValorMax] = useState<number | "">(
    searchParams?.['imovel.preco_max'] ?? ""
  );

  const inputRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const query: Record<string, string | string[] | undefined> = {};

  if (estado) query.estado_id = estado;
  if (cidade) query.cidade_id = cidade;
  if (bairro) query.bairros = [bairro];
  if (tipo) query.tipos = [tipo];
  if (codigo) query.código = codigo;
  if (valorMin !== "") query['imovel.preco_min'] = valorMin.toString();
  if (valorMax !== "") query['imovel.preco_max'] = valorMax.toString();

  const getSelectedFilters = () => {
    const filters = [];

    if (estado) {
      const nomeEstado = estados.find(
        (e) => e.value.toString() === estado
      )?.nome;
      if (nomeEstado) filters.push(nomeEstado);
    }

    if (cidade) {
      const nomeCidade = cidades.find(
        (c) => c.value.toString() === cidade
      )?.nome;
      if (nomeCidade) filters.push(nomeCidade);
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

  return (
    <form
      className={cn(
        "group w-[min(100%,62.5rem)] bg-white py-3 px-3 md:py-4 md:px-5 rounded-[.625rem]",
        className
      )}
      ref={inputRef}
      onSubmit={(e: FormEvent) => e.preventDefault()}
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
        <Link
          href={{
            pathname: "/imoveis",
            query: query,
          }}
          className="bg-[#2a2b2f] flex-shrink-0 text-[.75rem] md:text-sm py-2 px-4 md:px-6 rounded-lg"
        >
          Buscar imóveis
        </Link>
      </div>
      <motion.div
        className="bg-white [--display-from:none] [--display-to:block] md:[--display-to:flex] [--opacity-from:0] [--opacity-to:80%] *:text-black *:font-semibold absolute py-4 px-5 w-full bottom-0 translate-y-full left-0 md:gap-3 rounded-[.625rem] *:flex *:flex-wrap md:*:flex-nowrap *:justify-center md:*:justify-between *:items-center"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div className="md:w-[55%] *:w-[10.5rem] gap-2 *:rounded-xl *:border-black *:border">
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Estados" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estadoItem) => (
                <SelectItem
                  key={estadoItem.value}
                  value={estadoItem.value.toString()}
                >
                  {estadoItem.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cidade} onValueChange={setCidade} disabled={!estado}>
            <SelectTrigger>
              <SelectValue placeholder="Cidades" />
            </SelectTrigger>
            <SelectContent>
              {cidades
                // .filter((cidadeItem) => cidadeItem.estado_id.toString() === estado)
                .map((cidadeItem) => (
                  <SelectItem
                    key={cidadeItem.value}
                    value={cidadeItem.value.toString()}
                  >
                    {cidadeItem.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={bairro} onValueChange={setBairro} disabled={!cidade}>
            <SelectTrigger>
              <SelectValue placeholder="Bairros" />
            </SelectTrigger>
            <SelectContent>
              {bairros
                // .filter((bairroItem: any) => bairroItem.cidadeId.toString() === cidade)
                .map((bairroItem: any, index: number) => (
                  <SelectItem key={index} value={bairroItem}>
                    {bairroItem}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger>
              <SelectValue placeholder="Tipos" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipoItem, index) => (
                <SelectItem key={index} value={tipoItem}>
                  {tipoItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={codigo} onValueChange={setCodigo}>
            <SelectTrigger>
              <SelectValue placeholder="Códigos" />
            </SelectTrigger>
            <SelectContent>
              {codigos.map((codigoItem, index) => (
                <SelectItem key={index} value={codigoItem}>
                  {codigoItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
