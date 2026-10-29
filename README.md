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

- Dropdown with 35 selectable world time zones (India + Asia + Europe + Africa + Americas + Oceania).
- **+ Add Clock** button places the selected clock on the dashboard.
- All clocks update in real time, every second (single shared timer from the custom hook).
- **useRef** re-focuses the dropdown immediately after a clock is added.
- Reusable **`useClockTick`** custom hook returns a live `Date` instance.
- **useCallback** keeps `onZoneChange` / `onAdd` / `onRemove` / `onClear` handler identities stable.
- **React.memo** wraps `TimezoneToolbar` and `ClockCard`; the toolbar shows a render counter that freezes while the clocks keep ticking — a visible proof of reduced re-renders.
- Duplicate clocks are blocked with a friendly warning; each card has a remove button and a **Clear All** action exists.
- Empty-selection and unknown-zone validation with feedback messages announced via `aria-live="polite"`.
- Responsive dashboard: 1 column on mobile, 2 on tablet, 3 on large screens (Tailwind CSS v4).
- **Vercel-inspired UI** (see “UI Guidelines Applied” below): black canvas, Geist / Geist Mono typography, crisp translucent borders, `:focus-visible` rings, tabular-nums clock digits, designed empty state, skip link, and reduced-motion support.

## Technology Stack

- **React 19** (functional components only)
- **Vite 6** (dev server + production build)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (import-based setup, no config file)
- **Geist & Geist Mono** fonts, loaded from Google Fonts with `preconnect`
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
    ├── style.css                    ← @import "tailwindcss" + Vercel design tokens
    ├── data/
    │   └── timeZones.js             ← 35 IANA zones + getOffsetLabel() helper
    ├── hooks/
    │   └── useClockTick.js          ← custom hook: Date ticking every second
    └── Components/
        ├── TimezoneToolbar.jsx      ← memoized dropdown + Add/Clear (render counter)
        └── ClockCard.jsx            ← memoized clock card (time, date, offset, remove)
```

## UI Guidelines Applied (Vercel Web Interface Guidelines)

The interface was restyled to match the Vercel webapp using the published
[web-interface-guidelines](https://vercel.com/design/guidelines). Key
applications:

| Guideline | Implementation |
| --- | --- |
| Clear focus (`:focus-visible`) | Blue `#0070f3` focus rings on select, buttons, and icon buttons — pointer users see no distraction |
| Keyboard works everywhere | Skip-to-content link, semantic `header`/`main`/`footer`, hierarchical headings, native `button`/`label`/`select` |
| Announce async updates | `aria-live="polite"` region around add/remove/duplicate feedback |
| Redundant status cues | Warnings use icon + text + color, never color alone |
| Icon-only buttons are named | Remove buttons carry `aria-label` + `title` |
| Tabular numbers for comparisons | Geist Mono + `font-variant-numeric: tabular-nums` on every clock digit (no width jitter between ticks) |
| Never `transition: all` | Only `colors` / `transform` properties are animated, listed explicitly |
| Honor `prefers-reduced-motion` | Global media query disables decorative animation |
| Layered shadows & crisp borders | Two-layer card shadow + semi-transparent `white/8` borders that brighten on hover |
| Nested radii | Cards 12 px, controls 6 px, badges full — child radius ≤ parent |
| Windows `<select>` background | Explicit `background-color` + `color` (and `option` styling) |
| Mobile input size | Select uses 16 px text on mobile, 14 px from `md:` up (no iOS zoom) |
| Theme matches browser UI | `<meta name="theme-color" content="#000000">` + `color-scheme: dark` |
| Copywriting (Vercel voice) | Title Case headings/buttons, active voice, ellipsis character `…`, numerals for counts, positive error messages that guide the exit |
| Designed empty states | “No Clocks Yet” state with icon and a clear next step (no dead ends) |
| Preload fonts | `preconnect` to `fonts.googleapis.com` + `fonts.gstatic.com` before the Geist stylesheet |

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
- **useCallback handlers** — `handleAdd` depends on `[selectedZone, clocks]`;
  the single-argument handlers depend on `[]`. Because `App` re-renders every
  second, these stable references are what allow `React.memo` to skip
  re-renders of unchanged children.
- **Duplicate prevention** — `clocks.some(clock => clock.zone === selectedZone)`
  before appending; the message area explains why nothing was added.
- **Intl formatting** — `toLocaleTimeString` / `toLocaleDateString` with the
  `timeZone` option handle DST-correct local times; `timeZoneName:
  "shortOffset"` produces labels like `GMT+5:30`.

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
