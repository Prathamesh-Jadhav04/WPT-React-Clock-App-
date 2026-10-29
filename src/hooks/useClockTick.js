// ===== Custom Hook: useClockTick =====
// Assignment objective 5 — extract the "tick every second" logic into one
// reusable hook. Any component that calls useClockTick() gets a Date object
// that refreshes at the given interval, so every clock in the dashboard
// updates in real time from this single shared timer.
import { useEffect, useState } from "react";

function useClockTick(intervalMs = 1000) {
  // Start with the current moment as soon as the component mounts
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // One setInterval for the whole app — no per-clock timers
    const timerId = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    // Cleanup on unmount — avoids the memory-leak bug from missing cleanup
    return () => clearInterval(timerId);
  }, [intervalMs]);

  // Every new Date() instance re-renders the consumers of this hook
  return now;
}

export default useClockTick;
