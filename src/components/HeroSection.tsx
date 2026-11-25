import React, { useState } from 'react';
import { ArrowRight, Headphones, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { CHARACTERS, OFFICIAL_ASSETS } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import type { SiteContentConfig } from '../types';

interface HeroSectionProps {
  content: SiteContentConfig;
  onPrimaryCta: () => void;
}

export function HeroSection({ content, onPrimaryCta }: HeroSectionProps) {
  const { t } = useLocale();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const characterList = [
    CHARACTERS.nico,
    CHARACTERS.bruno,
    CHARACTERS.tito,
    CHARACTERS.mateo,
    CHARACTERS.aurelio,
  ];

  return (
    <section id="inicio" className="pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiet editorial utility strip above hero split */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2E8F2] dark:border-[#242E49]">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] text-[#525E7A] dark:text-[#9BA8C4]">
            <span className="font-medium text-[#1A2035] dark:text-[#F4F6FA]">{t.parentBrand}</span>
            <span aria-hidden="true">·</span>
            <span>{content.launchNote}</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#1A2035] dark:hover:text-[#F4F6FA] px-3 py-1.5 rounded-lg border border-[#DCE3F0] dark:border-[#2B3654] bg-white/70 dark:bg-[#1A2035]/70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {resolvedTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Modo oscuro</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left editorial copy column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-[#2270E2] dark:text-[#63A0FA] mb-4">
              {t.philosophyTagline}
            </p>

            <h1 className="text-[2.15rem] sm:text-[2.85rem] lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1A2035] dark:text-[#F4F6FA]">
              {content.heroTitle}
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-[1.65] text-[#4E5973] dark:text-[#A9B4CC] max-w-xl">
              {content.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white text-[15px] font-semibold px-6 py-3.5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="#audio-experiencia"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A2035] dark:text-[#E5EAF5] hover:text-[#2270E2] dark:hover:text-[#63A0FA] px-3 py-3 transition-colors whitespace-nowrap shrink-0"
              >
                <Headphones className="w-4 h-4 text-[#2270E2] dark:text-[#63A0FA]" aria-hidden="true" />
                <span>{t.hero.secondaryLink}</span>
              </a>
            </div>
          </motion.div>

          {/* Right 3D official universe visual carrier */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <figure className="h-full flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654]">
              <div className="relative aspect-[16/10] lg:flex-1 w-full bg-[#EEF2F8] dark:bg-[#1F2740] overflow-hidden">
                {!heroImgFailed ? (
                  <img
                    src={OFFICIAL_ASSETS.heroScene}
                    alt="Nico, Bruno, Tito, Mateo y Aurelio en un espacio arquitectónico minimalista de Te cuento tu primer paso"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={OFFICIAL_ASSETS.quintetLineup}
                    alt="Los cinco personajes oficiales: Nico, Bruno, Tito, Mateo y Aurelio"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-6 bg-[#F5F7FC]"
                  />
                )}
              </div>

              <figcaption className="px-5 py-4 bg-white dark:bg-[#1A2035] border-t border-[#E2E8F2] dark:border-[#2B3654] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                  Universo oficial
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {characterList.map((char) => (
                    <span
                      key={char.id}
                      className="inline-flex flex-col text-xs font-medium text-[#1A2035] dark:text-[#E5EAF5]"
                    >
                      <span>{char.name}</span>
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-full rounded-full mt-0.5"
                        style={{ backgroundColor: char.color }}
                      />
                    </span>
                  ))}
                </div>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
