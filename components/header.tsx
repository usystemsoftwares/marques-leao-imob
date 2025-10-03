"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import MarquesLeaoLogo from "/public/marqueseleao/Logo-Marques-Leao.webp"
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg"
import WhatsappIcon from "/public/marqueseleao/white-wpp-icon.svg"

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
  const menuRef = useRef<HTMLDivElement | null>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  })

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
    <header className="w-[min(90%,80rem)] mx-auto flex items-center justify-center md:justify-between pt-12">
      <Link href="/">
        <Image
          className="z-10 w-[12.5rem] sm:w-[17.5rem] mx-auto md:mx-0"
          src={MarquesLeaoLogo}
          alt="Logo"
          width={370}
          height={40}
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
      </Link>
      <motion.button
        onClick={toggleMenu}
        className={cn("w-7 aspect-square *:block *:h-[2px] *:bg-white fixed right-[2rem] z-[52] md:z-[100] md:relative", isOpen ? "hidden" : "inline-block")}
      >
        <span></span>
        <span className="mt-[.3125rem]"></span>
        <span className="mt-[.3125rem]"></span>
      </motion.button>
      <motion.nav
        ref={menuRef}
        className="rounded-l-xl fixed md:absolute px-8 pt-6 pb-24 right-0 top-0 w-[75%] sm:w-72 flex-col justify-between bg-[#131313] h-full z-[999]"
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
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
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
          className="*:text-center *:flex *:justify-center *:gap-2 *:text-sm *:py-[.625rem] *:rounded-lg mx-1"
        >
          <Link
            className="bg-[#108d10] mb-2"
            href="Whatsapp">
            <Image
              src={WhatsappIcon}
              alt="Whatsapp"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            WhatsApp</Link>
          <Link
            className="border-[1.78px] border-white"
            href="">
            <Image
              src={InstagramIcon}
              alt="Instagram"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            Instagram</Link>
        </div>
      </motion.nav>
    </header>
  );
}

export default Header