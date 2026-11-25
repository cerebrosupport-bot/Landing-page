import React, { useState } from 'react';
import { CHARACTERS, OFFICIAL_ASSETS } from '../data/content';
import type { CharacterId } from '../types';

interface CharacterPortraitProps {
  character: CharacterId | 'quintet';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-12 h-12 rounded-xl',
  md: 'w-16 h-16 rounded-2xl',
  lg: 'w-20 h-20 rounded-2xl',
};

export function CharacterPortrait({
  character,
  size = 'md',
  className = '',
}: CharacterPortraitProps) {
  const [imgError, setImgError] = useState(false);

  if (character === 'quintet') {
    return (
      <div
        className={`relative overflow-hidden bg-[#F5F7FC] dark:bg-[#E9EEF7] border border-[#E2E8F2] dark:border-[#324063] shrink-0 ${SIZE_CLASSES[size]} ${className}`}
      >
        {!imgError ? (
          <img
            src={OFFICIAL_ASSETS.quintetLineup}
            alt="Nico, Bruno, Tito, Mateo y Aurelio"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#1A2035]">
            5
          </div>
        )}
      </div>
    );
  }

  const meta = CHARACTERS[character];

  return (
    <div
      className={`relative overflow-hidden bg-[#F5F7FC] dark:bg-[#EAEFF8] border border-[#E2E8F2] dark:border-[#324063] shrink-0 ${SIZE_CLASSES[size]} ${className}`}
    >
      {!imgError ? (
        <img
          src={OFFICIAL_ASSETS.quintetLineup}
          alt={`${meta.name} — personaje oficial de Te cuento el porqué`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: '520%',
            maxWidth: 'none',
            height: 'auto',
            left: `${meta.cropLeftPct}%`,
            top: `${meta.cropTopPct}%`,
          }}
          className="absolute select-none pointer-events-none"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-white text-sm"
          style={{ backgroundColor: meta.color }}
        >
          {meta.name[0]}
        </div>
      )}
    </div>
  );
}
