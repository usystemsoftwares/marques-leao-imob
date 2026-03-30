const KNOWN_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_content",
  "utm_campaign",
  "utm_term",
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
  };

  // Todos os outros params vão para utm_metadata
  const utm_metadata: Record<string, string> = {};
  Object.keys(allParams).forEach((key) => {
    if (!KNOWN_UTM_KEYS.includes(key)) {
      utm_metadata[key] = allParams[key];
    }
  });

  return {
    ...knownUtms,
    utm_metadata:
      Object.keys(utm_metadata).length > 0
        ? utm_metadata
        : null,
  };
};
