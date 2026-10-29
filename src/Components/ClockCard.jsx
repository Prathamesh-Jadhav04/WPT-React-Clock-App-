// ===== ClockCard — memoized child component =====
// Assignment objective 6 — wrapped with React.memo so it only re-renders
// when its own props actually change. The parent (App) re-renders every
// second because of useClockTick, but thanks to React.memo + useCallback'd
// onRemove, this card is never re-rendered by unrelated parent renders —
// only by its own `now` prop (which is exactly what we want: the ticking time).
import React from "react";

function ClockCard({ id, label, timeZone, offsetLabel, now, onRemove }) {
  // Format the ticking Date for THIS card's time zone (taught Intl pattern)
  const timeText = now.toLocaleTimeString("en-IN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateText = now.toLocaleDateString("en-IN", {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="clock-card-in relative rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Remove button — calls the stable (useCallback) onRemove from App */}
      <button
        type="button"
        onClick={() => onRemove(id)}
        title={`Remove ${label} clock`}
        aria-label={`Remove ${label} clock`}
        className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-gray-400 transition-colors duration-300 hover:bg-red-500 hover:text-white"
      >
        ✕
      </button>

      {/* City / country label + IANA zone id */}
      <h2 className="pr-8 text-lg font-semibold text-gray-800">{label}</h2>
      <p className="mt-1 text-xs text-gray-500">
        {timeZone} · {offsetLabel}
      </p>

      {/* Big ticking time display with soft pulse ring */}
      <p className="clock-pulse mt-4 inline-block rounded-xl bg-orange-500 px-4 py-2 font-mono text-3xl font-bold tracking-wider text-white">
        {timeText}
      </p>

      {/* Local date inside that zone */}
      <p className="mt-3 text-sm text-gray-600">📅 {dateText}</p>
    </article>
  );
}

// React.memo — skip re-render when props (label/zone/now/onRemove) are unchanged
export default React.memo(ClockCard);
