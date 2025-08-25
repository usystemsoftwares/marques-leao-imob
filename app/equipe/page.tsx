import Header from "@/components/header";
import { WhatsappButton } from "@/components/whatsapp-btn";
import processarFiltros from "@/utils/processar-filtros-backend";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Corretor, Empresa } from "smart-imob-types";

async function getData(): Promise<{
  corretores: Corretor[];
  empresa: Empresa;
}> {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const params = new URLSearchParams({
    empresa_id,
    filtros: JSON.stringify(
      processarFiltros({
        ["corretor.aparecer_site"]: "1",
      })
    ),
  });

  const corretores = await fetch(`${uri}/corretores?${params.toString()}`, {
    next: { tags: ["corretores"], revalidate: 3600 },
  });

  if (!corretores.ok) {
    notFound();
  }

  const empresa = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });

  if (!empresa.ok) {
    notFound();
  }

  return {
    corretores: await corretores.json(),
    empresa: await empresa.json(),
  };
}

const TeamPage = async () => {
  const { corretores, empresa } = await getData();

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-16 w-[min(90%,75rem)] mx-auto mb-32">
        <div className="text-center max-w-[40ch] relative mx-auto">
          <h1
            className={`font-baskervville text-4xl font-bold text-center mb-2`}
          >
            <span className="font-bold">Equipe Marques & Leão</span>
          </h1>
          <h2>
            Conheça todas as pessoas que fazem a{" "}
            <span className="font-bold">Marques & Leão</span> ser a maior
            vitrine imobiliária da região.
          </h2>
        </div>
        <section className="mt-20">
          <ul className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {corretores
              .filter((corretor) => corretor.aparecer_site)
              .map((corretor) => (
                <li
                  key={corretor.db_id}
                  className="relative after:absolute after:bg-gradient-to-t rounded-[.625rem] overflow-hidden after:from-mainPurple after:to-transparent after:bottom-0 after:w-full after:h-1/5"
                >
                  <Link href={`/equipe/${corretor.db_id}`}>
                    <Image
                      className="w-full"
                      src={corretor.foto ?? ""}
                      alt={corretor.nome}
                      width={370}
                      height={452}
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div className="text-center absolute z-10 pb-3 w-full right-1/2 translate-x-1/2 bottom-0">
                      <h3 className="text-4xl font-semibold">
                        {corretor.nome}
                      </h3>
                      <h4 className="text-lg">{corretor.cargo}</h4>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
        <WhatsappButton empresa={empresa} />
      </main>
    </div>
  );
};

export default TeamPage;
