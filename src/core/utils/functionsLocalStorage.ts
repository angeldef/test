export const getLocal = (enumValue: string) => {
  const data = localStorage.getItem(enumValue);
  return data;
};

export const setLocal = (enumValue: string, value: string) => {
  localStorage.setItem(enumValue, value);
};

export const removeLocal = (enumValue: string) => {
  localStorage.removeItem(enumValue);
};
