// ===== Automated tests for the time zone data helpers =====
// Runs with Node's built-in test runner:  npm test  (node --test)
import test from "node:test";
import assert from "node:assert/strict";
import TIME_ZONES, { getOffsetLabel } from "../src/data/timeZones.js";

test("the dataset exposes at least 30 world time zones", () => {
  assert.ok(TIME_ZONES.length >= 30, `expected ≥30 zones, got ${TIME_ZONES.length}`);
});

test("every zone entry has a non-empty label and IANA id", () => {
  for (const entry of TIME_ZONES) {
    assert.equal(typeof entry.label, "string");
    assert.equal(typeof entry.zone, "string");
    assert.ok(entry.label.trim().length > 0, "label must not be empty");
    assert.ok(entry.zone.includes("/"), `zone id looks invalid: ${entry.zone}`);
  }
});

test("all zone ids are unique so duplicate clocks are easy to detect", () => {
  const ids = new Set(TIME_ZONES.map((entry) => entry.zone));
  assert.equal(ids.size, TIME_ZONES.length, "duplicate zone ids found");
});

test("getOffsetLabel returns the GMT offset for a known zone", () => {
  // Asia/Kolkata is always GMT+5:30 (no daylight saving)
  assert.equal(getOffsetLabel("Asia/Kolkata"), "GMT+5:30");
});

test("getOffsetLabel accepts a fixed date for deterministic checks", () => {
  const fixedDate = new Date("2026-01-15T12:00:00Z");
  const offset = getOffsetLabel("Europe/London", fixedDate);
  assert.equal(offset, "GMT"); // winter in London → GMT
});

test("getOffsetLabel degrades gracefully for an invalid zone", () => {
  // The helper catches Intl errors and returns "" instead of crashing
  // (expected console.error output appears below — the assertion is the return value)
  assert.equal(getOffsetLabel("Not/ARealZone"), "");
});
