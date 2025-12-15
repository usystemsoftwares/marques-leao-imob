const KNOWN_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_content",
  "utm_campaign",
  "utm_term",
  "utm_product_id",
  "utm_product_name",
];

export const getUtms = () => {
  const storedParams = localStorage.getItem("query_params");
  const allParams: Record<string, string> = storedParams
    ? JSON.parse(storedParams)
    : {};

  // UTMs conhecidos (campos dedicados na entity Cliente)
  const knownUtms = {
    utm_source: allParams.utm_source || null,
    utm_medium: allParams.utm_medium || null,
    utm_content: allParams.utm_content || null,
    utm_campaign: allParams.utm_campaign || null,
    utm_term: allParams.utm_term || null,
    utm_product_id: allParams.utm_product_id || null,
    utm_product_name: allParams.utm_product_name || null,
  };

  // Todos os outros params vão para campos_personalizados
  const camposPersonalizados: Record<string, string> = {};
  Object.keys(allParams).forEach((key) => {
    if (!KNOWN_UTM_KEYS.includes(key)) {
      camposPersonalizados[key] = allParams[key];
    }
  });

  return {
    ...knownUtms,
    campos_personalizados:
      Object.keys(camposPersonalizados).length > 0
        ? camposPersonalizados
        : null,
  };
};
