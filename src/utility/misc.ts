export const shortSlug = (text: string) => {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
};

export const timeSuffix = () => {
  return new Date()
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", "");
};
