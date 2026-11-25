import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className = '' }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="28"
          height="28"
          rx="8"
          className="fill-[#1A2035] dark:fill-[#2270E2]"
        />
        <rect x="6.5" y="16.5" width="5" height="5" rx="1.5" fill="#F4F6FA" fillOpacity="0.6" />
        <rect x="11.5" y="11.5" width="5" height="10" rx="1.5" fill="#F4F6FA" fillOpacity="0.82" />
        <rect x="16.5" y="6.5" width="5" height="15" rx="1.5" fill="#FFFFFF" />
      </svg>
      {!compact && (
        <span className="font-[family-name:var(--font-display)] text-[15px] sm:text-base font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
          Te cuento tu primer paso
        </span>
      )}
    </span>
  );
}
