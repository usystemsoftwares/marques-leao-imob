"use client";

import Image from "next/image";
import Link from "next/link";
import Whatsapp from "/public/marqueseleao/wpp-button.webp";
import { TelefoneFormatter } from "@/utils/generate_phone_href";
import { useEffect, useState } from "react";
import { Empresa } from "smart-imob-types";

export const WhatsappButton = ({ empresa }: { empresa: Empresa }) => {
  const [utmSource, setUtmSource] = useState<string | null>("");
  const personalLink = empresa.granato_gen?.["whats-button-link"];
  const telefone =
    empresa.telefones_empresa && empresa.telefones_empresa.length > 0
      ? TelefoneFormatter(
          empresa.telefones_empresa.find(
            (telefone) => telefone.whatsapp === true
          )
            ? (empresa.telefones_empresa || [])?.find(
                (telefone) => telefone?.whatsapp === true
              )?.telefone || ""
            : empresa.telefones_empresa[0].telefone
        )
      : empresa.telefone_empresa && empresa.telefone_empresa.length > 0
      ? empresa.telefone_empresa[0]
      : null;

  const textoWhats = empresa.texto_whats
    ? empresa.texto_whats.replace(/\|/g, "")
    : "";

  useEffect(() => {
    if (localStorage.getItem("utm_source")) {
      setUtmSource(localStorage.getItem("utm_source"));
    }
  }, []);

  return (
    <div className="fixed w-[min(3.125rem,100%)] md:w-[min(4.375rem,100%)] aspect-square right-[3.125rem] bottom-[2rem] md:bottom-[1.625rem] z-[51]">
      <Link
        href={
          "https://s.tintim.app/whatsapp/a9760b6e-fc26-4493-b2e3-7ff652429152/95b5bf55-8193-4994-adb1-92d308cc6b49" ||
          `https://api.whatsapp.com/send?phone=55${TelefoneFormatter(
            telefone || ""
          )}&text=${textoWhats} ${utmSource ? `| ${utmSource}` : ""}`
        }
        target="_blank"
      >
        <Image
          className="w-full"
          src={Whatsapp}
          alt="Whatsapp"
          width={0}
          height={0}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Link>
    </div>
  );
};
