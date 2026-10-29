// ===== Time zone master data =====
// Each entry maps a friendly country/city label to a unique IANA time zone id.
// The id is what Intl.DateTimeFormat needs to show the correct local time.
// (One Indian entry only — every Indian city shares the single Asia/Kolkata zone.)
const TIME_ZONES = [
  // ---- India ----
  { label: "India (IST) — Mumbai time", zone: "Asia/Kolkata" },

  // ---- Asia ----
  { label: "Dubai (GST)", zone: "Asia/Dubai" },
  { label: "Singapore (SGT)", zone: "Asia/Singapore" },
  { label: "Hong Kong (HKT)", zone: "Asia/Hong_Kong" },
  { label: "Bangkok (ICT)", zone: "Asia/Bangkok" },
  { label: "Jakarta (WIB)", zone: "Asia/Jakarta" },
  { label: "Kuala Lumpur (MYT)", zone: "Asia/Kuala_Lumpur" },
  { label: "Seoul (KST)", zone: "Asia/Seoul" },
  { label: "Tokyo (JST)", zone: "Asia/Tokyo" },
  { label: "Shanghai (CST)", zone: "Asia/Shanghai" },

  // ---- Europe ----
  { label: "London (GMT/BST)", zone: "Europe/London" },
  { label: "Paris (CET)", zone: "Europe/Paris" },
  { label: "Berlin (CET)", zone: "Europe/Berlin" },
  { label: "Zurich (CET)", zone: "Europe/Zurich" },
  { label: "Amsterdam (CET)", zone: "Europe/Amsterdam" },
  { label: "Madrid (CET)", zone: "Europe/Madrid" },
  { label: "Rome (CET)", zone: "Europe/Rome" },
  { label: "Istanbul (TRT)", zone: "Europe/Istanbul" },
  { label: "Moscow (MSK)", zone: "Europe/Moscow" },

  // ---- Africa ----
  { label: "Cairo (EET)", zone: "Africa/Cairo" },
  { label: "Nairobi (EAT)", zone: "Africa/Nairobi" },
  { label: "Johannesburg (SAST)", zone: "Africa/Johannesburg" },

  // ---- Americas ----
  { label: "New York (ET)", zone: "America/New_York" },
  { label: "Chicago (CT)", zone: "America/Chicago" },
  { label: "Denver (MT)", zone: "America/Denver" },
  { label: "Los Angeles (PT)", zone: "America/Los_Angeles" },
  { label: "Toronto (ET)", zone: "America/Toronto" },
  { label: "Vancouver (PT)", zone: "America/Vancouver" },
  { label: "Mexico City (CST)", zone: "America/Mexico_City" },
  { label: "São Paulo (BRT)", zone: "America/Sao_Paulo" },
  { label: "Buenos Aires (ART)", zone: "America/Argentina/Buenos_Aires" },

  // ---- Oceania ----
  { label: "Sydney (AEST)", zone: "Australia/Sydney" },
  { label: "Melbourne (AEST)", zone: "Australia/Melbourne" },
  { label: "Perth (AWST)", zone: "Australia/Perth" },
  { label: "Auckland (NZST)", zone: "Pacific/Auckland" },
];

export default TIME_ZONES;

// ===== Helper: get the UTC offset label of a zone, e.g. "GMT+5:30" =====
// Runs once per clock (while adding it), not on every tick.
export function getOffsetLabel(timeZone, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const offsetPart = parts.find((part) => part.type === "timeZoneName");
    return offsetPart ? offsetPart.value : "";
  } catch (error) {
    console.error("getOffsetLabel failed for", timeZone, error);
    return "";
  }
}
