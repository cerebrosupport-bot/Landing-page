import React, { useState } from 'react';
import { CHARACTERS, HOW_IT_WORKS_STEPS, PILLARS } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { CharacterPortrait } from './CharacterPortrait';

export function ProposalAndStepsSection() {
  const { locale, t } = useLocale();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* 2.4 Nuestra propuesta — 3 independent visual pillar cards */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#171E31] border-t border-[#E2E8F2] dark:border-[#242E49]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
              {t.proposal.kicker}
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
              {t.proposal.title}
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
              {t.proposal.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {PILLARS.map((pillar, idx) => {
              const spanClass =
                idx === 0
                  ? 'lg:col-span-12 xl:col-span-6'
                  : 'lg:col-span-6 xl:col-span-3';
              const isFeatured = idx === 0;

              return (
                <article
                  key={pillar.id}
                  className={`${spanClass} rounded-3xl overflow-hidden bg-[#F4F6FA] dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] flex flex-col`}
                >
                  <div
                    className={`relative w-full overflow-hidden bg-[#EAEFF8] dark:bg-[#222B45] ${
                      isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3]'
                    }`}
                  >
                    {!failedImages[pillar.id] ? (
                      <img
                        src={pillar.image}
                        alt={pillar.title[locale]}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [pillar.id]: true }))
                        }
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#525E7A]">
                        {pillar.title[locale]}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#525E7A] dark:text-[#9BA8C4] tabular-nums">
                        <span className="font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                          {pillar.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{pillar.characters}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
                        {pillar.title[locale]}
                      </h3>
                      <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#4E5973] dark:text-[#A9B4CC]">
                        {pillar.description[locale]}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.5 Cómo funciona — 4 clear steps */}
      <section
        id="como-funciona"
        className="py-16 sm:py-24 border-t border-[#E2E8F2] dark:border-[#242E49]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
              {t.howItWorks.kicker}
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
              {t.howItWorks.title}
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS_STEPS.map((step) => {
              const char = CHARACTERS[step.character];
              return (
                <li
                  key={step.number}
                  className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <CharacterPortrait character={step.character} size="sm" />
                      <span
                        className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-[#C9D3E6] dark:text-[#334163]"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                      <span
                        className="w-2.5 h-0.5 rounded-full"
                        style={{ backgroundColor: char.color }}
                        aria-hidden="true"
                      />
                      <span>Paso {step.number}</span>
                    </div>

                    <h3 className="mt-2 text-[17px] font-bold leading-snug text-[#1A2035] dark:text-[#F4F6FA]">
                      {step.title[locale]}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
                      {step.caption[locale]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
