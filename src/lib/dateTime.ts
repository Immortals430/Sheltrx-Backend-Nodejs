
export const HHMMSSToUTCISO = (timeString: string) =>
  new Date(`1970-01-01T${timeString}Z`);


export const UTCISOToHHMMSS = (UTCISODateTime: Date) => {
  const hh = String(UTCISODateTime.getUTCHours()).padStart(2, "0");
  const mm = String(UTCISODateTime.getUTCMinutes()).padStart(2, "0");
  const ss = String(UTCISODateTime.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const YYYYMMDDToUTCISO = (dateString: string) =>
  new Date(`${dateString}T00:00:00Z`);

export const UTCISOToYYYYMMDD = (UTCISODateTime: Date) =>
  UTCISODateTime.toISOString().split("T")[0];


export const getLocalTimeZone = (timezone: string) => {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: timezone || "Asia/Kolkata",
    hour12: false,
  });
};

export const getLocalDate = (timezone: string) => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: timezone || "Asia/Kolkata",
  });
};
