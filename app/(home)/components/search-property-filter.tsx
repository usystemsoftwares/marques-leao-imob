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
import { Imóvel } from "smart-imob-types";

const sideVariants = {
  closed: {
    display: "var(--display-from, none)",
    opacity: "var(--opacity-from, 0)",
  },
  open: {
    display: "var(--display-to, block)",
    opacity: "var(--opacity-to, 8)",
  },
};

type FormProps = {
  className?: string;
  imoveis: Imóvel[];
  estados: any[];
  cidades: any[];
  bairros: any[];
  tipos: any[];
  codigos: any[];
};

const SearchPropertyFilter = ({
  className,
  imoveis,
  cidades,
  bairros,
  tipos,
  codigos,
  estados,
}: FormProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <form
      action="/imoveis"
      className={cn(
        "group w-[min(100%,62.5rem)] bg-white py-3 px-3 md:py-4 md:px-5 rounded-[.625rem]",
        className
      )}
      ref={inputRef}
    >
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-full md:flex-1 pl-8 sm:pl-10 md:pl-12 bg-hero-input bg-[size:1.5rem] sm:bg-[size:auto] bg-no-repeat bg-left placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none"
          onClick={toggleMenu}
        />
        <button
          className="bg-[#2a2b2f] flex-shrink-0 text-[.75rem] md:text-sm py-2 px-4 md:px-6 rounded-lg"
          type="submit"
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RS">RS</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Cidades" />
            </SelectTrigger>
            <SelectContent>
              {(cidades || []).map((cidade) => (
                <SelectItem key={cidade.value} value={cidade.value}>
                  {cidade.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bairros" />
            </SelectTrigger>
            <SelectContent>
              {bairros.map((bairro, index) => (
                <SelectItem key={index} value={bairro}>
                  {bairro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipos" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo, index) => (
                <SelectItem key={index} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Códigos" />
            </SelectTrigger>
            <SelectContent>
              {/* {codigos.map((codigo) => (
                  <SelectItem key={codigo} value={codigo}>
                    {codigo}
                  </SelectItem>
                ))} */}
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
            />
          </label>
          <label>
            Valor máximo
            <input
              placeholder="R$0,00"
              className="outline-none w-16 placeholder:text-black"
              type="number"
            />
          </label>
        </div>
      </motion.div>
    </form>
  );
};

export default SearchPropertyFilter;
