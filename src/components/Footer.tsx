import React, { useState } from 'react';
import { Lock, Monitor, Moon, Sun, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../types';

type LegalDocType = 'privacy' | 'terms' | 'scope' | null;

interface FooterProps {
  onOpenAdmin: () => void;
}

const LEGAL_COPY: Record<
  Exclude<LegalDocType, null>,
  { title: string; paragraphs: string[] }
> = {
  privacy: {
    title: 'Política de privacidad',
    paragraphs: [
      'En Te cuento tu primer paso (Te cuento el porqué) recopilamos únicamente los datos que decides compartir de forma voluntaria en el formulario de acceso anticipado: tu nombre, tu correo electrónico y el área general que te gustaría trabajar.',
      'No solicitamos ni almacenamos diagnósticos médicos, historiales clínicos ni información psicológica sensible a través de esta landing page.',
      'Tus datos se guardan de manera segura con acceso restringido exclusivamente a personal autorizado y se utilizan únicamente para avisarte sobre el lanzamiento y novedades relacionadas con tu consentimiento. Puedes solicitar la eliminación de tus datos escribiendo a hola@tecuentoelporque.com.',
    ],
  },
  terms: {
    title: 'Términos y condiciones',
    paragraphs: [
      'Esta página tiene carácter informativo y de registro de interés para el futuro lanzamiento de la plataforma Te cuento tu primer paso.',
      'Las pantallas de vista previa y las muestras sonoras presentes en este sitio son demostrativas del concepto en desarrollo y no constituyen un contrato de prestación de servicios ni garantizan resultados específicos.',
      'Todos los personajes oficiales (Nico, Bruno, Tito, Mateo y Aurelio), textos y elementos gráficos pertenecen a la marca Te cuento el porqué.',
    ],
  },
  scope: {
    title: 'Alcance de los contenidos',
    paragraphs: [
      'Los contenidos de Te cuento tu primer paso están diseñados con un enfoque educativo, reflexivo y de acompañamiento cotidiano para el desarrollo personal.',
      'En ningún caso sustituyen la evaluación, el diagnóstico, la psicoterapia ni el tratamiento médico o psiquiátrico profesional cuando una persona lo requiere.',
      'Si atraviesas una situación de crisis emocional o emergencia, acude de inmediato a los servicios de salud o líneas de atención profesional disponibles en tu país.',
    ],
  },
};

export function Footer({ onOpenAdmin }: FooterProps) {
  const { locale, setLocale, t } = useLocale();
  const { preference, setPreference } = useTheme();
  const [legalModal, setLegalModal] = useState<LegalDocType>(null);

  const themeOptions: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
    { id: 'system', label: t.footer.themeSystem, icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'light', label: t.footer.themeLight, icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', label: t.footer.themeDark, icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <footer className="bg-[#F4F6FA] dark:bg-[#121726] border-t border-[#E2E8F2] dark:border-[#242E49] pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E2E8F2] dark:border-[#242E49]">
          {/* Brand & Slogan */}
          <div className="md:col-span-5">
            <BrandMark />
            <p className="mt-4 font-[family-name:var(--font-display)] text-base font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
              {t.brandSlogan}
            </p>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#525E7A] dark:text-[#9BA8C4] max-w-sm">
              Los contenidos de desarrollo personal de esta iniciativa no sustituyen la atención
              psicológica o médica profesional cuando esta sea necesaria.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                {t.footer.contactTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#525E7A] dark:text-[#9BA8C4]">
                <li>
                  <a
                    href="mailto:hola@tecuentoelporque.com"
                    className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors"
                  >
                    hola@tecuentoelporque.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                {t.footer.socialTitle}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#525E7A] dark:text-[#9BA8C4]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors"
                >
                  TikTok
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Preferences */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                {t.footer.legalTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#525E7A] dark:text-[#9BA8C4]">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors cursor-pointer"
                  >
                    {t.footer.privacy}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('terms')}
                    className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors cursor-pointer"
                  >
                    {t.footer.terms}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('scope')}
                    className="hover:text-[#2270E2] dark:hover:text-[#63A0FA] transition-colors cursor-pointer"
                  >
                    {t.footer.scope}
                  </button>
                </li>
              </ul>
            </div>

            {/* Theme & i18n controls */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div
                role="group"
                aria-label={t.footer.themeLabel}
                className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654]"
              >
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreference(opt.id)}
                    aria-pressed={preference === opt.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      preference === opt.id
                        ? 'bg-[#2270E2] text-white'
                        : 'text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#1A2035] dark:hover:text-[#F4F6FA]'
                    }`}
                  >
                    <span aria-hidden="true">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              <div
                role="group"
                aria-label={t.footer.languageLabel}
                className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654]"
              >
                <button
                  type="button"
                  onClick={() => setLocale('es')}
                  aria-pressed={locale === 'es'}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    locale === 'es'
                      ? 'bg-[#1A2035] dark:bg-[#2270E2] text-white'
                      : 'text-[#525E7A] dark:text-[#9BA8C4]'
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  aria-pressed={locale === 'en'}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    locale === 'en'
                      ? 'bg-[#1A2035] dark:bg-[#2270E2] text-white'
                      : 'text-[#525E7A] dark:text-[#9BA8C4]'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#697592] dark:text-[#8492B2]">
          <p>{t.footer.rights}</p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 hover:text-[#1A2035] dark:hover:text-[#F4F6FA] transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.footer.adminLink}</span>
          </button>
        </div>
      </div>

      {/* Accessible Legal & Scope Modal */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121726]/60 backdrop-blur-xs p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="max-w-lg w-full rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 sm:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="legal-modal-title"
                className="text-xl font-bold text-[#1A2035] dark:text-[#F4F6FA]"
              >
                {LEGAL_COPY[legalModal].title}
              </h2>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Cerrar ventana"
                className="w-9 h-9 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] flex items-center justify-center text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#1A2035] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-[#4E5973] dark:text-[#A9B4CC]">
              {LEGAL_COPY[legalModal].paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
