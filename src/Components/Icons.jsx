// ===== Shared inline SVG icons =====
// One source of truth for every glyph used in the dashboard — they inherit
// color via currentColor, are marked aria-hidden (decorative), and take a
// className so callers control size/placement. Extracted from inline JSX to
// keep the components focused on behavior, not markup.

function Icon({ className, strokeWidth = 2, children }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <Icon className={className}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <Icon className={className} strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CloseIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <Icon className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}

export function WarningIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <Icon className={className}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </Icon>
  );
}

export function SuccessIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function ClockIcon({ className = "h-6 w-6" }) {
  return (
    <Icon className={className} strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  );
}

// Vercel-style triangle mark used in the top bar (filled, not stroked)
export function TriangleMark({ className = "h-3.5 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 76 65"
      fill="currentColor"
      className={className}
    >
      <path d="M37.5266 0 75.0532 65H0L37.5266 0Z" />
    </svg>
  );
}
