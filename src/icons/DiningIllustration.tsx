import type { IconProps } from "./types";

export function DiningIllustration({ className = "h-40 w-40" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" fill="currentColor" aria-hidden="true">
      {/* Highlight edge (engraved depth) */}
      <g opacity="0.12" transform="translate(1.5, 1.5)">
        <path d="M62 10 L138 10 C148 28, 130 50, 103 55 L97 55 C70 50, 52 28, 62 10Z" />
        <rect x="97" y="55" width="6" height="23" rx="2" />
        <ellipse cx="100" cy="80" rx="24" ry="5" />
      </g>
      {/* Glass bowl */}
      <path d="M62 10 L138 10 C148 28, 130 50, 103 55 L97 55 C70 50, 52 28, 62 10Z" opacity="0.4" />
      {/* Wine fill */}
      <path d="M68 28 L132 28 C140 42, 130 50, 103 55 L97 55 C70 50, 60 42, 68 28Z" opacity="0.25" />
      {/* Stem */}
      <rect x="97" y="55" width="6" height="23" rx="2" opacity="0.5" />
      {/* Base */}
      <ellipse cx="100" cy="80" rx="24" ry="5" opacity="0.35" />
    </svg>
  );
}
