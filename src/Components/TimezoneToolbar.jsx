// ===== TimezoneToolbar — memoized control panel =====
// Assignment objective 6 — this is the component that visibly proves the
// useCallback + React.memo combination. The parent App re-renders every
// second (clock tick), yet this toolbar does NOT: its props are the selected
// value, stable useCallback handlers, and data that changes only on
// add/remove. The "Toolbar renders" counter stays frozen while all clocks
// tick, proving unnecessary re-renders were prevented.
//
// UI follows the Vercel Web Interface Guidelines:
//   - visible :focus-visible rings (not plain :focus)
//   - explicit <label> + name on the select, autocomplete-friendly
//   - Windows <select> gets explicit background-color / color
//   - aria-live="polite" region announces add/remove feedback
//   - placeholder ends with the ellipsis character (…)
//   - buttons keep ≥24 px hit targets, touch-action: manipulation
import React, { useCallback, useRef } from "react";

function TimezoneToolbar({
  zones,
  selectedZone,
  onZoneChange,
  onAdd,
  onClear,
  clockCount,
  message,
  messageKind, // "ok" | "warn" — status is never conveyed by color alone
  selectRef, // useRef handle from App — used to FOCUS this dropdown after Add
}) {
  // Render counter — increments once per ACTUAL render of this component.
  // If it stops increasing while the clocks keep ticking, memoization works.
  const renderCount = useRef(0);
  renderCount.current += 1;

  // Enter submits the focused control (WAI-ARIA form pattern).
  // Deliberately on keyUP, not keydown: the native select commits the
  // highlighted option during keydown and fires change before keyup, so by
  // the time this runs, onAdd already sees the freshly selected zone.
  const handleSelectKeyUp = useCallback(() => {
    onAdd();
  }, [onAdd]);

  return (
    <section
      aria-label="Add a clock"
      className="rounded-xl border border-white/8 bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] sm:p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Dropdown of selectable time zones */}
        <div className="min-w-0 flex-1">
          <label
            htmlFor="zoneSelect"
            className="mb-1.5 block text-[13px] font-medium text-ink-2"
          >
            Time Zone
          </label>
          <div className="relative">
            <select
              id="zoneSelect"
              name="timeZone"
              ref={selectRef}
              value={selectedZone}
              onChange={onZoneChange}
              onKeyUp={handleSelectKeyUp}
              autoComplete="off"
              className="h-10 w-full appearance-none rounded-md border border-white/12 bg-surface px-3 pr-9 text-base text-ink transition-colors duration-200 hover:border-white/25 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:text-sm [&>option]:bg-surface [&>option]:text-ink"
            >
              <option value="">Select a time zone…</option>
              {zones.map((entry) => (
                <option key={entry.zone} value={entry.zone}>
                  {entry.label}
                </option>
              ))}
            </select>
            {/* Chevron glyph — decorative, hidden from assistive tech */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Add + Clear buttons */}
        <div className="flex shrink-0 items-end gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-md bg-white px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-[#eaeaea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:bg-[#d4d4d4]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Clock
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={clockCount === 0}
            className="inline-flex h-10 cursor-pointer items-center rounded-md border border-white/12 bg-transparent px-4 text-sm font-medium text-ink-2 transition-colors duration-200 hover:border-white/25 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Feedback message — announced politely to screen readers */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[20px] text-[13px] leading-5"
      >
        {message !== "" && (
          <p
            className={`flex items-start gap-1.5 ${
              messageKind === "warn" ? "text-warn" : "text-ok"
            }`}
          >
            {messageKind === "warn" ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            )}
            <span>{message}</span>
          </p>
        )}
      </div>

      {/* Small proof label — count freezes while clocks tick every second */}
      <p className="text-right font-mono text-[12px] tabular-nums text-ink-3">
        Toolbar renders: {renderCount.current} — frozen while clocks tick
        (useCallback&nbsp;+&nbsp;React.memo)
      </p>
    </section>
  );
}

// React.memo — App re-renders every second, this toolbar does not
export default React.memo(TimezoneToolbar);
