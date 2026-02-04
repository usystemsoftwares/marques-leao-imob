"use client"

import { useEffect } from "react"

/**
 * Provider global para proteção de imagens
 * - Bloqueia clique direito em todas as imagens
 * - Bloqueia drag and drop global
 * - Adiciona user-select: none no body
 */
export default function ImageProtectionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Prevenir clique direito em imagens
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        e.preventDefault()
        return false
      }
    }

    // Prevenir drag em imagens
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        e.preventDefault()
        return false
      }
    }

    // Adicionar listeners globais
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("dragstart", handleDragStart)

    // Adicionar CSS global para user-select
    const style = document.createElement("style")
    style.innerHTML = `
      img {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        pointer-events: auto;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("dragstart", handleDragStart)
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}
