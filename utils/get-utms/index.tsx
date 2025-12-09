export const getUtms = () => {
  const utms = {
    utm_source: localStorage.getItem("utm_source"),
    utm_medium: localStorage.getItem("utm_medium"),
    utm_content: localStorage.getItem("utm_content"),
    utm_campaign: localStorage.getItem("utm_campaign"),
    utm_term: localStorage.getItem("utm_term"),
    utm_product_id: localStorage.getItem("utm_product_id"),
    utm_product_name: localStorage.getItem("utm_product_name"),
  };
  return utms;
};
