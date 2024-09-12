"use client"

import { corretores } from "@/data"
import Image from "next/image"
import Link from "next/link"

type BaskervvilleProps = {
  baskervville: string;
}

const EstateAgents = ({ baskervville }: BaskervvilleProps) => {
  return (
    <div className="md:flex md:flex-row-reverse md:justify-between">
      <div>
        {/* <Image 
        src={}
        alt=""
        /> */}
        <h3 className={`text-6xl ${baskervville}`}>Maria Luiza Souza</h3>
        <p className={`text-xl`}>Um texto breve sobre a correta Maria Luiza Souza</p>
        <div className="md:flex">
          <p>imóveis em carteira</p>
          <p>anos de experiência</p>
          <Link
            className="none md:block"
            href={""}>Conhecer </Link>
        </div>
        <Link
          className="block md:none"
          href={""}>Conhecer </Link>
      </div>
      <ul className="grid grid-cols-3">
        {corretores.map(corretor => (
          <li
            key={corretor.id}
            className="rounded-[.625rem] overflow-hidden"
          >
            <Image
              width={202}
              height={244}
              src={corretor.image}
              alt={corretor.name}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EstateAgents