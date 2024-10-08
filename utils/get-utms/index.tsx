export const getUtms = () => {
  const utms = {
    utm_source: localStorage.getItem("utm_source"),
    utm_medium: localStorage.getItem("utm_medium"),
    utm_content: localStorage.getItem("utm_content"),
    utm_campaign: localStorage.getItem("utm_campaign"),
    utm_term: localStorage.getItem("utm_term"),
  };
  return utms;
};
