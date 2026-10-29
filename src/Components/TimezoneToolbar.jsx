// ===== TimezoneToolbar — memoized control panel =====
// Assignment objective 6 — this is the component that visibly proves the
// useCallback + React.memo combination. The parent App re-renders every
// second (clock tick), yet this toolbar does NOT: its props are the selected
// value, stable useCallback handlers, and data that changes only on
// add/remove. The "Re-renders" counter below stays frozen while all clocks
// tick, proving unnecessary re-renders were prevented.
import React, { useRef } from "react";

function TimezoneToolbar({
  zones,
  selectedZone,
  onZoneChange,
  onAdd,
  onClear,
  clockCount,
  message,
  selectRef, // useRef handle from App — used to FOCUS this dropdown after Add
}) {
  // Render counter — increments once per ACTUAL render of this component.
  // If it stops increasing while the clocks keep ticking, memoization works.
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        {/* Dropdown of selectable time zones */}
        <div className="flex-1">
          <label
            htmlFor="zoneSelect"
            className="mb-1 block text-sm font-semibold text-gray-700"
          >
            Select country / city time zone
          </label>
          <select
            id="zoneSelect"
            name="zoneSelect"
            ref={selectRef}
            value={selectedZone}
            onChange={onZoneChange}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 outline-none transition-shadow duration-300 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.25)]"
          >
            <option value="">-- Choose a time zone --</option>
            {zones.map((entry) => (
              <option key={entry.zone} value={entry.zone}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add button — displays the selected clock */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="cursor-pointer rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-orange-600 active:scale-95"
          >
            + Add Clock
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={clockCount === 0}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-600 transition-colors duration-300 hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Feedback message (added / duplicate / empty selection) */}
      {message !== "" && (
        <p className="mt-3 text-sm font-medium text-amber-600">{message}</p>
      )}

      {/* Small proof label — count freezes while clocks tick every second */}
      <p className="mt-3 text-right text-xs text-gray-400">
        Toolbar re-renders: {renderCount.current} (stays fixed while clocks
        tick — thanks to useCallback + React.memo)
      </p>
    </section>
  );
}

// React.memo — App re-renders every second, this toolbar does not
export default React.memo(TimezoneToolbar);
