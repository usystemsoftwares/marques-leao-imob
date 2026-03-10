"use client"

import Image from "next/image"
import { ComponentProps, useEffect, useRef } from "react"

type ProtectedImageProps = ComponentProps<typeof Image> & {
  disableRightClick?: boolean
  disableDragAndDrop?: boolean
}

/**
 * Componente de imagem protegida contra download
 * - Bloqueia clique direito
 * - Bloqueia drag and drop
 * - Adiciona atributo draggable=false
 */
export default function ProtectedImage({
  disableRightClick = true,
  disableDragAndDrop = true,
  ...props
}: ProtectedImageProps) {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imgElement = imgRef.current

    if (!imgElement) return

    // Prevenir clique direito
    const handleContextMenu = (e: MouseEvent) => {
      if (disableRightClick) {
        e.preventDefault()
        return false
      }
    }

    // Prevenir drag and drop
    const handleDragStart = (e: DragEvent) => {
      if (disableDragAndDrop) {
        e.preventDefault()
        return false
      }
    }

    imgElement.addEventListener("contextmenu", handleContextMenu)
    imgElement.addEventListener("dragstart", handleDragStart)

    return () => {
      imgElement.removeEventListener("contextmenu", handleContextMenu)
      imgElement.removeEventListener("dragstart", handleDragStart)
    }
  }, [disableRightClick, disableDragAndDrop])

  return (
    <div
      ref={imgRef}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <Image
        {...props}
        draggable={false}
        onContextMenu={(e) => {
          if (disableRightClick) {
            e.preventDefault()
            return false
          }
        }}
        onDragStart={(e) => {
          if (disableDragAndDrop) {
            e.preventDefault()
            return false
          }
        }}
      />
    </div>
  )
}
