"use client"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import SearchIcon from "/public/marqueseleao/white-search-icon.svg"

type FormProps = React.HtmlHTMLAttributes<HTMLFormElement>

const PropertyFilter = ({ className }: FormProps) => {
  return (
    <div className={cn("flex items-center justify-between w-[min(100%,31.875rem)] rounded-[.625rem] py-1 px-3 mx-auto bg-white text-black font-medium", className)}>
      <div className="relative flex *:border-0">
        <Select>
          <SelectTrigger className="*:hidden relative *:after:absolute *:after:right-0 *:after:bg-[#707070] *:after:h-1/2 *:after:w-[1px] *:after:bottom-1/2 *:after:translate-y-1/2">
            <SelectValue placeholder="Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RS">RS</SelectItem>
            <SelectItem value="SC">SC</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="*:hidden relative *:after:absolute *:after:right-0 *:after:bg-[#707070] *:after:h-1/2 *:after:w-[1px] *:after:translate-y-1/2 *:after:bottom-1/2">
            <SelectValue placeholder="Código" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="C3">C3</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="*:hidden relative *:after:absolute *:after:right-0 *:after:bg-[#707070] *:after:h-1/2 *:after:w-[1px] *:after:translate-y-1/2 *:after:bottom-1/2">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Boa Vista">Boa Vista</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="*:hidden relative *:after:absolute *:after:right-0 *:after:bg-[#707070] *:after:h-1/2 *:after:w-[1px] *:after:translate-y-1/2 *:after:bottom-1/2">
            <SelectValue placeholder="Valor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="710500">R$ 710.500</SelectItem>
            <SelectItem value="500000">R$ 500.000</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="*:hidden">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Apartamento">Apartamento</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <button className="relative bg-mainPurple w-9 aspect-square rounded-full">
        <Image
          className="absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2"
          width={16}
          height={16}
          src={SearchIcon}
          alt="Ícone de pesquisa"
        />
      </button>
    </div>
  )
}

export default PropertyFilter