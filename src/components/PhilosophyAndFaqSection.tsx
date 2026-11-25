import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Info } from 'lucide-react';
import { FAQ_ITEMS } from '../data/content';
import { useLocale } from '../context/LocaleContext';

interface PhilosophyAndFaqSectionProps {
  philosophyQuote: string;
  onCtaClick: () => void;
}

export function PhilosophyAndFaqSection({
  philosophyQuote,
  onCtaClick,
}: PhilosophyAndFaqSectionProps) {
  const { locale, t } = useLocale();
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <>
      {/* 2.8 Nuestra filosofía */}
      <section className="py-20 sm:py-28 bg-white dark:bg-[#171E31] border-t border-[#E2E8F2] dark:border-[#242E49]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
            {t.philosophy.kicker}
          </p>
          <blockquote className="mt-4 font-[family-name:var(--font-display)] text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold leading-[1.16] tracking-[-0.025em] text-[#1A2035] dark:text-[#F4F6FA]">
            {philosophyQuote}
          </blockquote>
          <p className="mt-6 text-base sm:text-lg leading-[1.7] text-[#4E5973] dark:text-[#A9B4CC] max-w-2xl mx-auto">
            {t.philosophy.body}
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1A2035] dark:bg-[#2270E2] hover:bg-[#28314E] dark:hover:bg-[#1B5EC0] text-white text-sm font-semibold px-6 py-3.5 transition-colors cursor-pointer"
            >
              <span>{t.philosophy.cta}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 2.9 Preguntas frecuentes */}
      <section
        id="preguntas-frecuentes"
        className="py-16 sm:py-24 border-t border-[#E2E8F2] dark:border-[#242E49]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
              {t.faq.kicker}
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
              {t.faq.title}
            </h2>
          </div>

          <div className="mt-10 divide-y divide-[#E2E8F2] dark:divide-[#26314D] rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] px-6 sm:px-8">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 text-left py-1 cursor-pointer group"
                  >
                    <span className="font-[family-name:var(--font-display)] text-base sm:text-[17px] font-semibold text-[#1A2035] dark:text-[#F4F6FA] group-hover:text-[#2270E2] dark:group-hover:text-[#63A0FA] transition-colors">
                      {item.question[locale]}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#697592] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2270E2]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-panel-${item.id}`}
                      className="pt-3 pr-8 text-sm sm:text-[15px] leading-relaxed text-[#4E5973] dark:text-[#A9B4CC]"
                    >
                      {item.answer[locale]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explicit scope disclaimer */}
          <div className="mt-6 rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-5 flex items-start gap-3.5">
            <Info
              className="w-5 h-5 text-[#2270E2] dark:text-[#63A0FA] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-sm leading-relaxed text-[#4E5973] dark:text-[#A9B4CC]">
              {t.faq.scopeNotice}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
