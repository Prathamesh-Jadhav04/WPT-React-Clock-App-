// ===== ClockCard — memoized child component =====
// Assignment objective 6 — wrapped with React.memo so it only re-renders
// when its own props actually change. The parent (App) re-renders every
// second because of useClockTick, but thanks to React.memo + useCallback'd
// onRemove, this card is never re-rendered by unrelated parent renders —
// only by its own `now` prop (which is exactly what we want: the ticking time).
//
// UI follows the Vercel Web Interface Guidelines:
//   - Geist Mono + tabular-nums so digits never jitter between ticks
//   - crisp semi-transparent border, nested radii (card 12 px, button 6 px)
//   - icon-only remove button has an aria-label (never color alone)
//   - hover raises contrast; transitions list explicit properties only
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

  // Split "09:41:22 pm" → time + uppercase meridiem (Vercel-style hierarchy)
  const [timeMain, meridiem = ""] = timeText.split(" ");

  return (
    <article className="clock-card-in rounded-xl border border-white/8 bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] transition-colors duration-200 hover:border-white/20 sm:p-5">
      {/* City / country label + remove button */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            className="truncate text-[15px] font-medium leading-6 text-ink"
            title={label}
          >
            {label}
          </h2>
          {/* IANA zone id + UTC offset — technical identifiers, shielded
              from browser auto-translate */}
          <p
            translate="no"
            className="mt-0.5 truncate font-mono text-[12px] text-ink-3"
          >
            {timeZone} · {offsetLabel}
          </p>
        </div>

        {/* Remove button — calls the stable (useCallback) onRemove from App */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          title={`Remove ${label} clock`}
          aria-label={`Remove ${label} clock`}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-3 transition-colors duration-200 hover:bg-white/8 hover:text-[#e5484d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Big ticking time — mono, tabular figures, seconds + meridiem muted */}
      <p className="mt-4 font-mono text-[28px] font-medium leading-none tracking-tight tabular-nums text-ink sm:text-[32px]">
        {timeMain}
        {meridiem !== "" && (
          <span className="ml-1.5 text-[14px] font-normal uppercase text-ink-3">
            {meridiem}
          </span>
        )}
      </p>

      {/* Local date inside that zone */}
      <p className="mt-3 text-[13px] text-ink-2">{dateText}</p>
    </article>
  );
}

// React.memo — skip re-render when props (label/zone/now/onRemove) are unchanged
export default React.memo(ClockCard);
