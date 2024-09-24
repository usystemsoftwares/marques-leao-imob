"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const sideVariants = {
  closed: {
    display: "var(--display-from, none)",
    opacity: "var(--opacity-from, 0)",
  },
  open: {
    display: "var(--display-to, block)",
    opacity: "var(--opacity-to, 9)"
  }
}

type FormProps = React.HtmlHTMLAttributes<HTMLFormElement>

const SearchPropertyFilter = ({ className }: FormProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  })

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <form
      action="/imoveis"
      className={cn("group w-[min(100%,71.875rem)] bg-white py-3 px-3 rounded-[.625rem]", className)}
      ref={inputRef}
    >
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Clique para iniciar sua busca"
          className="w-full sm:flex-1 pl-6 sm:pl-10 bg-hero-input bg-no-repeat bg-[size:1.25rem] sm:bg-[size:auto] bg-left placeholder:text-black placeholder:text-[.75rem] md:placeholder:text-base placeholder:italic text-black outline-none"
          onClick={toggleMenu}
        />
        <button
          className="bg-[#2a2b2f] text-[.75rem] flex-shrink-0 py-2 px-4 lg:px-6 rounded-lg"
          type="submit"
        >Buscar imóveis</button>
      </div>
      <motion.div
        className="bg-white [--display-from:none] [--display-to:block] [--opacity-from:0] [--opacity-to:90%] *:text-black *:font-semibold z-50 absolute py-4 px-5 w-full bottom-0 translate-y-full left-0 md:gap-3 rounded-[.625rem] "
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div className="max-w-[37.5rem] px-3 mx-auto *:flex *:flex-wrap *:justify-center *:items-center">
          <div className="*:w-[10.5rem] gap-4 *:rounded-xl *:border-black *:border">
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
                <SelectItem value="Campo Bom">Campo Bom</SelectItem>
                <SelectItem value="Novo Hamburgo">Novo Hamburgo</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Bairros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boa Vista">Boa Vista</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="Apartamento">Apartamento</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Códigos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RS">RS</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            className="relative justify-between w-full md:w-[80%] md:mx-auto flex-col mt-3 *:w-full *:flex *:justify-between *:border-black *:border *:rounded-lg gap-3 *:py-2 *:px-3"
          >
            <label>
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
        </div>
      </motion.div>
    </form>
  )
}

export default SearchPropertyFilter