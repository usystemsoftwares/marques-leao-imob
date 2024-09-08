"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MarquesLeaoLogo from "/public/marqueseleao/Logo-Marques-Leao.webp"

const sideVariants = {
  closed: {
    display: "none",
    opacity: 0,
  },
  open: {
    display: "flex",
    opacity: 1,
  }
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      href: "/imoveis",
      label: "Imóveis",
      active: pathname === "/imoveis"
    },
    {
      href: "/equipe",
      label: "Equipe",
      active: pathname === "/equipe"
    },
  ]

  return (
    <header className="w-[min(90%,80rem)] mx-auto flex items-center justify-between pt-12">
      <div className="hidden"></div>
      <Image
        className="z-10 w-[12.5rem] md:w-[17.5rem] mx-auto md:mx-0"
        src={MarquesLeaoLogo}
        alt="Logo"
        width={370}
        height={40}
      />
      <motion.button
        onClick={toggleMenu}
        className="w-7 aspect-square *:block *:h-[2px] *:bg-white relative z-10"
      >
        <span></span>
        <span className="mt-[.3125rem]"></span>
        <span className="mt-[.3125rem]"></span>
      </motion.button>
      <motion.nav
        className="rounded-l-xl fixed md:absolute px-8 pt-6 pb-24 right-0 top-0 w-[75%] md:w-72 flex-col justify-between bg-[#131313] h-full z-20"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sideVariants}
      >
        <div
          className="flex flex-col"
        >
          <button
            onClick={toggleMenu}
            className="w-[26px] aspect-square *:block *:h-[2px] *:origin-[3px_1px] *:bg-white ml-auto"
          >
            <span className="rotate-[45deg] mb-[5px]"></span>
            <span className="mb-[5px] opacity-0"></span>
            <span className="rotate-[-45deg]"></span>
          </button>
          <Image
            className="mx-auto mt-10"
            src={MarquesLeaoLogo}
            width={180}
            height={40}
            alt="Logo"
          />
          <ul className="*:mt-6 pl-10">
            {routes.map(route => (
              <li
                key={route.href}
              >
                <Link
                  className={cn("hover:text-[#430c38] text-sm", route.active ? "text-[#430c38]" : "")}
                  href={route.href}
                >{route.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="*:text-center *:block *:text-sm *:p-2 *:rounded-lg mx-1"
        >
          <Link
            className="bg-[#108d10] mb-2"
            href="">WhatsApp</Link>
          <Link
            className="border border-white"
            href="">Instagram</Link>
        </div>
      </motion.nav>
    </header>
  )
}

export default Header