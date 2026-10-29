// ===== App — React Clock App: Advanced Time Zone Manager =====
// Assignment 7 (React JS · Hooks). Demonstrates:
//   1-3. dropdown + Add button + multiple real-time clocks
//   4.   useRef  → focus the dropdown after adding a clock
//   5.   custom useClockTick hook → shared per-second ticking
//   6.   useCallback + React.memo → stable handlers, fewer child re-renders
//   7.   duplicate prevention + remove / clear all
//   8.   responsive dashboard (Tailwind CSS v4 utilities)
//
// Visual language follows the Vercel Web Interface Guidelines: black canvas,
// Geist type, crisp translucent borders, layered shadows, nested radii,
// visible focus rings, polite aria-live announcements, designed empty state,
// Title Case headings, and a "skip to content" link.
import { useCallback, useEffect, useRef, useState } from "react";
import useClockTick from "./hooks/useClockTick.js";
import TIME_ZONES, { getOffsetLabel } from "./data/timeZones.js";
import TimezoneToolbar from "./Components/TimezoneToolbar.jsx";
import ClockCard from "./Components/ClockCard.jsx";
import { ClockIcon, TriangleMark } from "./Components/Icons.jsx";

export default function App() {
  // ===== Objective 5: custom hook gives one Date that ticks every second =====
  const now = useClockTick(1000);

  // ===== App state =====
  const [clocks, setClocks] = useState([]); // added clocks
  const [selectedZone, setSelectedZone] = useState(""); // dropdown value
  // Feedback message: text + kind ("ok" | "warn") so status never relies on
  // color alone (icon + wording carry the same meaning)
  const [message, setMessage] = useState({ text: "", kind: "ok" });

  // ===== Objective 4: useRef to focus the dropdown programmatically =====
  const zoneSelectRef = useRef(null);

  // ===== Objective 6: useCallback keeps these handlers STABLE =====
  // App re-renders every second (clock tick). Without useCallback, every
  // render would create fresh function props and the memoized children
  // (TimezoneToolbar, ClockCard) would re-render for no reason.

  const handleZoneChange = useCallback((event) => {
    setSelectedZone(event.target.value);
    setMessage({ text: "", kind: "ok" });
  }, []);

  const handleAdd = useCallback(() => {
    // Validation 1 — nothing selected (positive, action-guiding copy)
    if (selectedZone === "") {
      setMessage({
        text: "Select a time zone, then choose Add Clock.",
        kind: "warn",
      });
      return;
    }

    const entry = TIME_ZONES.find((item) => item.zone === selectedZone);
    if (!entry) {
      setMessage({
        text: "That time zone isn’t available. Choose one from the list.",
        kind: "warn",
      });
      return;
    }

    // Validation 2 — objective 7: prevent duplicate clocks
    if (clocks.some((clock) => clock.zone === selectedZone)) {
      setMessage({
        text: `${entry.label} is already on the dashboard. Select another time zone.`,
        kind: "warn",
      });
      return;
    }

    // Add the clock (offset label is computed once, not every tick)
    setClocks([
      ...clocks,
      {
        id: entry.zone,
        label: entry.label,
        zone: entry.zone,
        offset: getOffsetLabel(entry.zone),
      },
    ]);
    setSelectedZone("");
    setMessage({ text: `Added ${entry.label}.`, kind: "ok" });

    // Objective 4 — immediately focus the dropdown for the next selection
    if (zoneSelectRef.current) {
      zoneSelectRef.current.focus();
    }
  }, [selectedZone, clocks]);

  // Functional state update with filter — immutable remove
  const handleRemove = useCallback((id) => {
    setClocks((previousClocks) =>
      previousClocks.filter((clock) => clock.id !== id)
    );
    setMessage({ text: "Clock removed.", kind: "ok" });
  }, []);

  const handleClear = useCallback(() => {
    setClocks([]);
    setSelectedZone("");
    setMessage({ text: "All clocks cleared.", kind: "ok" });
  }, []);

  // Auto-dismiss feedback after 4 s so stale messages don't linger.
  // The cleanup clears the pending timer whenever a NEW message arrives.
  useEffect(() => {
    if (message.text === "") return undefined;
    const timerId = setTimeout(() => {
      setMessage({ text: "", kind: "ok" });
    }, 4000);
    return () => clearTimeout(timerId);
  }, [message]);

  // Accurate page title — reflect the current clock count in the browser tab
  useEffect(() => {
    document.title =
      clocks.length > 0
        ? `World Clocks (${clocks.length}) — React Clock App`
        : "World Clocks — React Clock App";
  }, [clocks.length]);

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Skip link — jumps keyboard users straight past the top bar */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>

      {/* ===== Top bar — Vercel dashboard style ===== */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo lockup: triangle mark + product name + context */}
          <div className="flex min-w-0 items-center gap-2.5">
            <TriangleMark className="h-3.5 w-4 shrink-0 text-white" />
            <span className="text-[15px] font-semibold text-ink">Clocks</span>
            <span aria-hidden="true" className="text-ink-3">
              /
            </span>
            <span className="hidden truncate text-[13px] text-ink-2 sm:inline">
              Advanced Time Zone Manager
            </span>
          </div>

          {/* Live home-time pill — status dot + mono tabular readout */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-surface py-1 pl-2.5 pr-3 text-[13px] text-ink-2">
            <span
              aria-hidden="true"
              className="live-dot h-1.5 w-1.5 rounded-full bg-ok"
            />
            <span>IST</span>
            <span translate="no" className="font-mono tabular-nums text-ink">
              {now.toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl scroll-mt-16 px-4 pb-16 pt-8 sm:px-6"
      >
        {/* Page heading — Title Case, numeral badge for the count */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              World Clocks
            </h1>
            <span className="rounded-full bg-white/8 px-2 py-0.5 text-[12px] font-medium tabular-nums text-ink-2">
              {clocks.length}
            </span>
            <p className="ml-auto hidden text-[13px] text-ink-3 sm:block">
              Updates every second
            </p>
          </div>
          <p className="mt-1 text-[13px] text-ink-2">
            Select a country or city time zone, then choose Add Clock.
          </p>
        </header>

        {/* Toolbar: dropdown + Add (memoized — re-render proof) */}
        <div className="mt-6">
          <TimezoneToolbar
            zones={TIME_ZONES}
            selectedZone={selectedZone}
            onZoneChange={handleZoneChange}
            onAdd={handleAdd}
            onClear={handleClear}
            clockCount={clocks.length}
            message={message.text}
            messageKind={message.kind}
            selectRef={zoneSelectRef}
          />
        </div>

        {/* Clock dashboard grid — responsive 1 / 2 / 3 columns */}
        <section aria-label="Added clocks" className="mt-8">
          {clocks.length === 0 ? (
            // Empty state — designed, with a clear next step (no dead ends)
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/12 bg-surface px-6 py-14 text-center">
              <ClockIcon className="h-6 w-6 text-ink-3" />
              <h2 className="mt-3 text-sm font-medium text-ink">
                No Clocks Yet
              </h2>
              <p className="mt-1 max-w-xs text-[13px] text-ink-2">
                Select a time zone above, then choose Add Clock.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clocks.map((clock) => (
                <ClockCard
                  key={clock.id}
                  id={clock.id}
                  label={clock.label}
                  timeZone={clock.zone}
                  offsetLabel={clock.offset}
                  now={now}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </section>

        {/* Concept note — what this assignment demonstrates */}
        <section className="mt-10 rounded-xl border border-white/8 bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">About This Demo</h2>
          <dl className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="inline-block rounded-md border border-white/10 bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-ink">
                useRef
              </dt>
              <dd className="mt-1.5 text-[13px] leading-5 text-ink-2">
                The dropdown is focused again right after a clock is added.
              </dd>
            </div>
            <div>
              <dt className="inline-block rounded-md border border-white/10 bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-ink">
                useClockTick
              </dt>
              <dd className="mt-1.5 text-[13px] leading-5 text-ink-2">
                A custom hook keeps one shared timer that every clock reads
                from.
              </dd>
            </div>
            <div>
              <dt className="inline-block rounded-md border border-white/10 bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-ink">
                useCallback&nbsp;+&nbsp;React.memo
              </dt>
              <dd className="mt-1.5 text-[13px] leading-5 text-ink-2">
                Stable handlers let memoized children skip re-renders while the
                clocks tick.
              </dd>
            </div>
          </dl>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            React Clock App · WPT Assignment 7 — React&nbsp;JS Hooks
          </p>
          <p translate="no">
            Prathamesh Jadhav · Roll No.&nbsp;16 · CDAC ATC Nashik
          </p>
        </div>
      </footer>
    </div>
  );
}
