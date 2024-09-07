"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const Navbar = () => {
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
    <header>

    </header>
  )
}

export default Navbar