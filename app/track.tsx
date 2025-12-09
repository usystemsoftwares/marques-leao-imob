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
      const utmParams = new URLSearchParams(queryString);
      if (utmParams.get("utm_source")) {
        localStorage.setItem("utm_source", utmParams.get("utm_source") || "");
        localStorage.setItem("utm_medium", utmParams.get("utm_medium") || "");
        localStorage.setItem("utm_content", utmParams.get("utm_content") || "");
        localStorage.setItem(
          "utm_campaign",
          utmParams.get("utm_campaign") || ""
        );
        localStorage.setItem("utm_term", utmParams.get("utm_term") || "");
        localStorage.setItem("utm_product_id", utmParams.get("utm_product_id") || "");
        localStorage.setItem("utm_product_name", utmParams.get("utm_product_name") || "");
      }
    }
  }, [empresaId]);

  return null;
}
