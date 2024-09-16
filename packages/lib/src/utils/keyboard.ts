export const stopPropagation = (e: KeyboardEvent): void => {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();
};
