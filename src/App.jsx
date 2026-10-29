// ===== App — React Clock App: Advanced Time Zone Manager =====
// Assignment 7 (React JS · Hooks). Demonstrates:
//   1-3. dropdown + Add button + multiple real-time clocks
//   4.   useRef  → focus the dropdown after adding a clock
//   5.   custom useClockTick hook → shared per-second ticking
//   6.   useCallback + React.memo → stable handlers, fewer child re-renders
//   7.   duplicate prevention + remove / clear all
//   8.   responsive dashboard (Tailwind CSS v4 utilities)
import { useCallback, useRef, useState } from "react";
import useClockTick from "./hooks/useClockTick.js";
import TIME_ZONES, { getOffsetLabel } from "./data/timeZones.js";
import TimezoneToolbar from "./Components/TimezoneToolbar.jsx";
import ClockCard from "./Components/ClockCard.jsx";

export default function App() {
  // ===== Objective 5: custom hook gives one Date that ticks every second =====
  const now = useClockTick(1000);

  // ===== App state =====
  const [clocks, setClocks] = useState([]); // added clocks
  const [selectedZone, setSelectedZone] = useState(""); // dropdown value
  const [message, setMessage] = useState(""); // feedback line

  // ===== Objective 4: useRef to focus the dropdown programmatically =====
  const zoneSelectRef = useRef(null);

  // ===== Objective 6: useCallback keeps these handlers STABLE =====
  // App re-renders every second (clock tick). Without useCallback, every
  // render would create fresh function props and the memoized children
  // (TimezoneToolbar, ClockCard) would re-render for no reason.

  const handleZoneChange = useCallback((event) => {
    setSelectedZone(event.target.value);
    setMessage("");
  }, []);

  const handleAdd = useCallback(() => {
    // Validation 1 — nothing selected
    if (selectedZone === "") {
      setMessage("⚠️ Please select a time zone before clicking Add.");
      return;
    }

    const entry = TIME_ZONES.find((item) => item.zone === selectedZone);
    if (!entry) {
      setMessage("⚠️ Unknown time zone selected.");
      return;
    }

    // Validation 2 — objective 7: prevent duplicate clocks
    if (clocks.some((clock) => clock.zone === selectedZone)) {
      setMessage(`⚠️ The "${entry.label}" clock is already on the dashboard.`);
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
    setMessage(`✅ "${entry.label}" clock added.`);

    // Objective 4 — immediately focus the dropdown for the next selection
    if (zoneSelectRef.current) {
      zoneSelectRef.current.focus();
    }
  }, [selectedZone, clocks]);

  // Functional state update with spread/filter — immutable remove
  const handleRemove = useCallback((id) => {
    setClocks((previousClocks) =>
      previousClocks.filter((clock) => clock.id !== id)
    );
    setMessage("🗑️ Clock removed.");
  }, []);

  const handleClear = useCallback(() => {
    setClocks([]);
    setSelectedZone("");
    setMessage("🗑️ All clocks cleared.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 pb-10">
      {/* ===== Header — with a live home-time (IST) readout ===== */}
      <header className="mb-6 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              🕰️ React Clock App
            </h1>
            <p className="text-sm text-orange-300">
              Advanced Time Zone Manager — multiple clocks, ticking live every
              second
            </p>
          </div>
          <p className="font-mono text-lg font-semibold text-orange-400">
            India{" "}
            {now.toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* ===== Toolbar: dropdown + Add (memoized — re-render proof) ===== */}
        <TimezoneToolbar
          zones={TIME_ZONES}
          selectedZone={selectedZone}
          onZoneChange={handleZoneChange}
          onAdd={handleAdd}
          onClear={handleClear}
          clockCount={clocks.length}
          message={message}
          selectRef={zoneSelectRef}
        />

        {/* ===== Clock dashboard grid — responsive 1 / 2 / 3 columns ===== */}
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            World Clocks{" "}
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-sm text-white">
              {clocks.length}
            </span>
          </h2>

          {clocks.length === 0 ? (
            // Empty state — shown until the first clock is added
            <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-gray-300">
              No clocks yet — pick a time zone above and click{" "}
              <span className="font-semibold text-orange-400">+ Add Clock</span>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* ===== Concept note — what this assignment demonstrates ===== */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300">
          <h3 className="mb-2 font-semibold text-orange-400">
            Concepts demonstrated
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <b className="text-white">useRef</b> — the dropdown is focused
              again right after a clock is added.
            </li>
            <li>
              <b className="text-white">useClockTick (custom hook)</b> — one
              reusable ticking <code className="text-orange-300">Date</code>{" "}
              shared by every clock.
            </li>
            <li>
              <b className="text-white">useCallback + React.memo</b> — toolbar
              and clock cards skip unnecessary re-renders while the clocks tick
              (watch the render counter in the toolbar).
            </li>
          </ul>
        </section>
      </main>

      {/* ===== Footer — author details ===== */}
      <footer className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-gray-400">
        <p>
          WPT Assignment 7 · React JS Hooks · Prathamesh Jadhav — Roll No. 16 ·
          CDAC ATC Nashik
        </p>
      </footer>
    </div>
  );
}
