# React Clock App — Advanced Time Zone Manager

**Assignment 7 — WPT · React JS · Hooks**

A React dashboard where the user picks a country/city time zone from a
dropdown, clicks **Add Clock**, and sees that clock appear and tick live every
second. The app supports many clocks at once, prevents duplicates, lets the
user remove clocks, and refreshes focus back to the dropdown after each add.

The project exists to demonstrate three important React concepts:

- **useRef** — focus the time-zone dropdown programmatically after adding a clock.
- **Custom `useClockTick` Hook** — reusable ticking logic that updates every clock once per second.
- **useCallback + React.memo** — stable callback references so memoized child components skip unnecessary re-renders (visible via the toolbar render counter).

## Features

- Dropdown with selectable world time zones (India + Asia + Europe + Africa + Americas + Oceania).
- **+ Add Clock** button places the selected clock on the dashboard.
- All clocks update in real time, every second (single shared timer from the custom hook).
- **useRef** re-focuses the dropdown immediately after a clock is added.
- Reusable **`useClockTick`** custom hook returns a live `Date` instance.
- **useCallback** keeps `onZoneChange` / `onAdd` / `onRemove` / `onClear` handler identities stable.
- **React.memo** wraps `TimezoneToolbar` and `ClockCard`; the toolbar shows a render counter that freezes while the clocks keep ticking — a visible proof of reduced re-renders.
- Duplicate clocks are blocked with a friendly warning; each card has a remove button and a **Clear All** action exists.
- Empty-selection and unknown-zone validation with feedback messages.
- Responsive dashboard: 1 column on mobile, 2 on tablet, 3 on large screens (Tailwind CSS v4).
- Modern styling: gradient background, glass-style cards, fade-up entrance animation.

## Technology Stack

- **React 19** (functional components only)
- **Vite 6** (dev server + production build)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (import-based setup, no config file)
- **ESLint 9** flat config with `react-hooks` + `react-refresh` plugins
- Browser `Intl.DateTimeFormat` for per-zone time/date/offset formatting (no extra libraries)

## Project Structure

```
react-clock-app/
├── index.html                       ← Vite entry (root div + module script)
├── package.json                     ← scripts + dependencies
├── vite.config.js                   ← react() + tailwindcss() plugins
├── eslint.config.js                 ← ESLint 9 flat config
├── README.md
└── src/
    ├── main.jsx                     ← createRoot(...).render(<App/>)
    ├── App.jsx                      ← state, useRef, useCallback handlers, dashboard
    ├── style.css                    ← @import "tailwindcss" + @keyframes animations
    ├── data/
    │   └── timeZones.js             ← IANA zones + helpers
    ├── hooks/
    │   └── useClockTick.js          ← custom hook: Date ticking every second
    └── Components/
        ├── TimezoneToolbar.jsx      ← dropdown + Add/Clear (render counter)
        └── ClockCard.jsx            ← clock card (time, date, offset, remove)
```

## Installation and Execution

```bash
# 1. move into the project folder
cd react-clock-app

# 2. install dependencies
npm install

# 3. start the development server
npm run dev
# open the printed link (usually http://localhost:5173)

# production build + local preview
npm run build
npm run preview

# static analysis
npm run lint
```

## Data Storage

No database or localStorage is used — clocks live in React state for the
session. Adding a clock stores `{ id, label, zone, offset }` where `id` is the
unique IANA zone id, which doubles as the duplicate check key and the list
`key` prop.

## Implementation Highlights

- **`useClockTick(intervalMs = 1000)`** — one `setInterval` for the whole app,
  cleaned up on unmount, exposing the current `Date`. Every card formats that
  single `now` for its own zone, so N clocks still share one timer.
- **useRef focus flow** — `zoneSelectRef` is created in `App`, passed to
  `TimezoneToolbar` as `selectRef`, and `zoneSelectRef.current.focus()` runs
  right after a successful add.
- **useCallback handlers** — stable handler identities are what allow
  `React.memo` to skip re-renders of unchanged children while `App` re-renders
  every second.
- **Duplicate prevention** — `clocks.some(clock => clock.zone === selectedZone)`
  before appending; the message area explains why nothing was added.
- **Intl formatting** — `toLocaleTimeString` / `toLocaleDateString` with the
  `timeZone` option handle DST-correct local times.

## Learning Outcomes

- Building a reusable custom hook and sharing one timer across many components.
- Programmatic focus control with `useRef` in a real interaction flow.
- Measuring and preventing unnecessary re-renders with `useCallback` + `React.memo`.
- Rendering dynamic lists with proper `key` props and immutable state updates.
- Responsive, modern UI design with Tailwind CSS v4 utilities and keyframe animations.
- Working with the browser `Intl` API for global time-zone aware formatting.

## Author

**Name:** Prathamesh Jadhav
**Roll No:** 16
**Course:** CDAC WPT (Web Programming Technologies) — MET IIT CDAC-ATC Nashik

_“Time, made visible — one tick at a time.”_
