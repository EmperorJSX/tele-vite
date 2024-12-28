export const parseI18nKey = (key: string): string => {
  return key.replace(/(?<![\.r])\[(\d+)\]/g, ".$1");
};
