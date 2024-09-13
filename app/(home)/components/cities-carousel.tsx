"use client"

import UseEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import CampoBom from "/public/marqueseleao/campo-bom.webp"
import NovoHamburgo from "/public/marqueseleao/novo-hamburgo.webp"
import SantaCatarina from "/public/marqueseleao/santa-catarina.webp"
import EstanciaVelha from "/public/marqueseleao/estancia-velha.webp"
import { motion, Variants } from "framer-motion"
import { useState } from "react"

const itemVariants: Variants = {
  normal: {
    opacity: 0,
    display: "unset"
  },
  active: {
    opacity: 1,
    display: "none"
  }
}

type BaskervvilleProps = {
  baskervville: string;
}

const CitiesCarousel = ({ baskervville }: BaskervvilleProps) => {
  const [isActive, setIsActive] = useState(false)
  const [emblaRef, emblaApi] = UseEmblaCarousel({ dragFree: true })

  return (
    <div className={`embla overflow-x-hidden ${baskervville} mt-8`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container *:w-[min(100%,16.875rem)] *:overflow-hidden *:rounded-xl *:relative *:flex-shrink-0 *:flex-grow-0 gap-12">
          <motion.div whileHover={{

          }}>
            <Image
              src={NovoHamburgo}
              alt="Novo Hamburgo prédios"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60">Novo Hamburgo</p>
          </motion.div>
          <motion.div>
            <Image
              src={CampoBom}
              alt="Campo bom paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60">Campo Bom</p>
          </motion.div>
          <motion.div>
            <Image
              src={EstanciaVelha}
              alt="Estancia Velha paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60">Estancia Velha</p>
          </motion.div>
          <motion.div>
            <Image
              src={SantaCatarina}
              alt="Santa Catarina paisagem"
            />
            <p className="absolute bottom-0 text-center w-full py-2 bg-[#666666] bg-opacity-60">Santa Catarina</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CitiesCarousel