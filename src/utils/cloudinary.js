export const cloudinaryOptimize = (url, type = "detail") => {
  if (!url || !url.includes("/upload/")) return url;

  const presets = {
    thumbnail: "f_auto,q_auto,c_fill,w_400",
    card: "f_auto,q_auto,c_fill,w_600",
    detail: "f_auto,q_auto:best,c_limit,w_1400",
    hero: "f_auto,q_auto,w_1600,dpr_auto",
    zoom: "f_auto,q_auto:best,c_limit,w_2000",
  };

  return url.replace(
    "/upload/",
    `/upload/${presets[type]}/`
  );
};
