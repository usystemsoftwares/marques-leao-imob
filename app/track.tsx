"use client";

import SmartTrack from "@/utils/SmartTrack";
import { useEffect } from "react";

export function Track({ empresaId }: { empresaId: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.track) {
        window.track = new SmartTrack(empresaId);
      }

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      // Captura TODOS os query params da URL
      const allParams: Record<string, string> = {};
      urlParams.forEach((value, key) => {
        allParams[key] = value;
      });

      // Salva todos os params se houver algum
      if (Object.keys(allParams).length > 0) {
        localStorage.setItem("query_params", JSON.stringify(allParams));
      }
    }
  }, [empresaId]);

  return null;
}
