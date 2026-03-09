import slugify from "slugify";

export const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'\"!:@]/g,
};

export const slugifyString = (str: string | undefined | null) => {
  return slugify(str || "", slugifyOptions);
};
