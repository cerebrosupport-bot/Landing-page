import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { CHARACTERS, INTEREST_TOPICS } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { CharacterPortrait } from './CharacterPortrait';
import type { InterestAreaId } from '../types';

interface IdentificationSectionProps {
  selectedArea: InterestAreaId | '';
  onSelectArea: (area: InterestAreaId) => void;
}

export function IdentificationSection({
  selectedArea,
  onSelectArea,
}: IdentificationSectionProps) {
  const { locale, t } = useLocale();

  return (
    <section
      id="que-trabajar"
      className="py-16 sm:py-24 border-t border-[#E2E8F2] dark:border-[#242E49]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
            {t.identification.kicker}
          </p>
          <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
            {t.identification.title}
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
            {t.identification.subtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEREST_TOPICS.map((topic, index) => {
            const isSelected = selectedArea === topic.id;
            const isOpenOption = topic.id === 'unsure';
            const characterLabel =
              topic.character === 'quintet'
                ? 'Acompañamiento abierto'
                : CHARACTERS[topic.character].name;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectArea(topic.id)}
                aria-pressed={isSelected}
                className={`group text-left rounded-2xl p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer border ${
                  isOpenOption ? 'sm:col-span-2 lg:col-span-3' : ''
                } ${
                  isSelected
                    ? 'bg-white dark:bg-[#1D253E] border-[#2270E2] ring-1 ring-[#2270E2]'
                    : 'bg-white dark:bg-[#1A2035] border-[#E2E8F2] dark:border-[#2B3654] hover:border-[#B9C7E0] dark:hover:border-[#3D4E75]'
                }`}
              >
                <div
                  className={`flex ${
                    isOpenOption
                      ? 'flex-col sm:flex-row sm:items-center gap-5'
                      : 'flex-col gap-5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <CharacterPortrait
                      character={topic.character}
                      size="md"
                    />
                    <span
                      className="text-xs font-medium text-[#525E7A] dark:text-[#9BA8C4] tabular-nums"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#525E7A] dark:text-[#9BA8C4] mb-1.5">
                      <span
                        className="inline-block w-2.5 h-0.5 rounded-full"
                        style={{ backgroundColor: topic.accentColor }}
                        aria-hidden="true"
                      />
                      <span>{characterLabel}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A2035] dark:text-[#F4F6FA] group-hover:text-[#2270E2] dark:group-hover:text-[#63A0FA] transition-colors">
                      {topic.label[locale]}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
                      {topic.description[locale]}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EEF2F7] dark:border-[#26314D] flex items-center justify-between text-xs font-semibold">
                  <span
                    className={
                      isSelected
                        ? 'text-[#2270E2] dark:text-[#63A0FA] inline-flex items-center gap-1.5'
                        : 'text-[#4A556E] dark:text-[#A9B4CC] group-hover:text-[#2270E2] dark:group-hover:text-[#63A0FA] transition-colors'
                    }
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.identification.selectedBadge}</span>
                      </>
                    ) : (
                      <span>{t.identification.cardAction}</span>
                    )}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#7A86A1] group-hover:text-[#2270E2] dark:group-hover:text-[#63A0FA] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
