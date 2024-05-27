export const escapeSpecialCharacters = (term: string): string => {
  return term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
