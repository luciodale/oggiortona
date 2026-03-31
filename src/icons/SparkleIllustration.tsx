import type { IconProps } from "./types";

export function SparkleIllustration({ className = "h-40 w-40" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      {/* Highlight edge (engraved depth) */}
      <g opacity="0.12" transform="translate(1.2, 1.2)">
        <path d="M50 8 C53 42, 58 47, 92 50 C58 53, 53 58, 50 92 C47 58, 42 53, 8 50 C42 47, 47 42, 50 8Z" />
        <path d="M78 12 C79 19, 81 21, 88 22 C81 23, 79 25, 78 32 C77 25, 75 23, 68 22 C75 21, 77 19, 78 12Z" />
        <path d="M25 64 C26 70, 27 71, 33 72 C27 73, 26 74, 25 80 C24 74, 23 73, 17 72 C23 71, 24 70, 25 64Z" />
      </g>
      {/* Main 4-pointed star */}
      <path d="M50 8 C53 42, 58 47, 92 50 C58 53, 53 58, 50 92 C47 58, 42 53, 8 50 C42 47, 47 42, 50 8Z" opacity="0.45" />
      {/* Inner glow */}
      <circle cx="50" cy="50" r="8" opacity="0.2" />
      {/* Small sparkle top-right */}
      <path d="M78 12 C79 19, 81 21, 88 22 C81 23, 79 25, 78 32 C77 25, 75 23, 68 22 C75 21, 77 19, 78 12Z" opacity="0.3" />
      {/* Small sparkle bottom-left */}
      <path d="M25 64 C26 70, 27 71, 33 72 C27 73, 26 74, 25 80 C24 74, 23 73, 17 72 C23 71, 24 70, 25 64Z" opacity="0.3" />
    </svg>
  );
}
