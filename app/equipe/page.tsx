import Header from "@/components/header"
import { WhatsappButton } from "@/components/whatsapp-btn"
import { equipe } from "@/data";
import { Baskervville } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"]
});

const TeamPage = () => {
  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-16 w-[min(90%,75rem)] mx-auto mb-32">
        <div className="text-center max-w-[40ch] relative mx-auto">
          <h1 className={`${baskervville.className} text-4xl font-bold text-center mb-2`}><span className="font-bold">Equipe Marques & Leão</span></h1>
          <h2>Conheça todas as pessoas que fazem a <span className="font-bold">Marques & Leão</span> ser a maior vitrine imobiliária da região.</h2>
        </div>
        <section className="mt-20">
          <ul className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((member) => (
              <li
                key={member.id}
                className="relative after:absolute after:bg-gradient-to-t rounded-[.625rem] overflow-hidden after:from-mainPurple after:to-transparent after:bottom-0 after:w-full after:h-1/5"
              >
                <Link
                  href={`/equipe/${member.id}`}
                >
                  <Image
                    className="w-full"
                    src={member.imagem}
                    alt={member.nome}
                    width={370}
                    height={452}
                  />
                  <div className="text-center absolute z-10 pb-3 w-full right-1/2 translate-x-1/2 bottom-0">
                    <h3 className="text-4xl font-semibold">{member.nome}</h3>
                    <h4 className="text-lg">{member.funcao}</h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <WhatsappButton />
      </main>
    </div>
  )
}

export default TeamPage