export const isEmail = (identifier: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
};
