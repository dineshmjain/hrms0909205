const MS_PER_DAY = 24 * 60 * 60 * 1000;
const IST_TZ = "Asia/Kolkata";

// Normalize a date to 00:00 IST
export const toIstDay = (d) => {
  const dt = new Date(d);
  // Format into YYYY-MM-DD at IST, then rebuild Date
  return new Date(dt.toLocaleDateString("en-CA", { timeZone: IST_TZ }));
};

// Add n days
export const addDays = (d, n) => new Date(d.getTime() + n * MS_PER_DAY);

// Get weekday name in IST
export const getIstWeekday = (d) =>
  d.toLocaleDateString("en-US", { weekday: "long", timeZone: IST_TZ });
