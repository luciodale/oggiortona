import type { IconProps } from "./types";

export function ShoppingBagIllustration({ className = "h-40 w-40" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" fill="currentColor" aria-hidden="true">
      {/* Highlight edge (engraved depth) */}
      <g opacity="0.12" transform="translate(1.5, 1.5)">
        {/* Large bag body */}
        <path d="M95 38 L170 38 L173 90 C173 93, 170 95, 167 95 L98 95 C95 95, 92 93, 92 90 Z" />
        {/* Large bag handle */}
        <path d="M115 38 C115 22, 122 15, 132 15 C142 15, 149 22, 149 38 L145 38 C145 25, 140 19, 132 19 C124 19, 119 25, 119 38 Z" />
        {/* Small bag body */}
        <path d="M32 55 L72 55 L74 90 C74 93, 72 95, 70 95 L34 95 C32 95, 30 93, 30 90 Z" />
        {/* Small bag handle */}
        <path d="M42 55 C42 45, 47 40, 52 40 C57 40, 62 45, 62 55 L59 55 C59 48, 56 44, 52 44 C48 44, 45 48, 45 55 Z" />
      </g>
      {/* Large bag body */}
      <path d="M95 38 L170 38 L173 90 C173 93, 170 95, 167 95 L98 95 C95 95, 92 93, 92 90 Z" opacity="0.4" />
      {/* Large bag handle */}
      <path d="M115 38 C115 22, 122 15, 132 15 C142 15, 149 22, 149 38 L145 38 C145 25, 140 19, 132 19 C124 19, 119 25, 119 38 Z" opacity="0.45" />
      {/* Small bag body */}
      <path d="M32 55 L72 55 L74 90 C74 93, 72 95, 70 95 L34 95 C32 95, 30 93, 30 90 Z" opacity="0.3" />
      {/* Small bag handle */}
      <path d="M42 55 C42 45, 47 40, 52 40 C57 40, 62 45, 62 55 L59 55 C59 48, 56 44, 52 44 C48 44, 45 48, 45 55 Z" opacity="0.35" />
    </svg>
  );
}
