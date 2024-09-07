"use client"

import Link from "next/link"

const EstateAgents = () => {
  return (
    <div className="md:flex">
      <div>
        {/* <Image /> */}
        <h3>Maria Luiza Souza</h3>
        <p>Um texto breve sobre a correta Maria Luiza Souza</p>
        <div className="md:flex">
          <p>imóveis em carteira</p>
          <p>anos de experiência</p>
          <Link className="none md:block" href={""}>Conhecer </Link>
        </div>
        <Link className="block md:none" href={""}>Conhecer </Link>
      </div>
      <div className="grid">

      </div>
    </div>
  )
}

export default EstateAgents