import React, { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Copy, Share2 } from 'lucide-react';
import { getInterestLabel, INTEREST_TOPICS } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { submitLead, trackAnalyticsEvent } from '../firebase';
import {
  VALIDATION_LIMITS,
  type InterestAreaId,
  type LeadSource,
} from '../types';

interface LeadCaptureSectionProps {
  selectedArea: InterestAreaId | '';
  source: LeadSource;
  onChangeArea: (area: InterestAreaId) => void;
}

const COOLDOWN_MS = 25000;

export function LeadCaptureSection({
  selectedArea,
  source,
  onChangeArea,
}: LeadCaptureSectionProps) {
  const { locale, t } = useLocale();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interestArea, setInterestArea] = useState<InterestAreaId>(
    selectedArea || 'procrastination'
  );
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mountedAtRef = useRef<number>(Date.now());
  const lastSubmitAtRef = useRef<number>(0);

  useEffect(() => {
    if (selectedArea) {
      setInterestArea(selectedArea);
    }
  }, [selectedArea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Anti-spam: honeypot filled by automated script
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    // Anti-spam: instant bot submit or rapid duplicate submissions
    const now = Date.now();
    if (now - mountedAtRef.current < 1000) {
      setErrorMessage('Por favor espera un momento antes de enviar el formulario.');
      return;
    }
    if (now - lastSubmitAtRef.current < COOLDOWN_MS) {
      setErrorMessage('Ya recibimos tu registro hace un instante. Gracias por tu paciencia.');
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < VALIDATION_LIMITS.LEAD_NAME_MIN) {
      setErrorMessage('Escribe al menos 2 caracteres en tu nombre.');
      return;
    }
    if (!VALIDATION_LIMITS.EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage('Revisa que tu correo electrónico tenga un formato válido.');
      return;
    }
    if (!consent) {
      setErrorMessage('Marca la casilla de consentimiento para poder avisarte sobre el lanzamiento.');
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        name: cleanName,
        email: cleanEmail,
        interestArea,
        consent: true,
        locale,
        source,
      });
      lastSubmitAtRef.current = Date.now();
      void trackAnalyticsEvent('lead_submit', interestArea, locale);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'No pudimos guardar tu registro en este momento. Intenta de nuevo en unos segundos.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText =
    'Te cuento tu primer paso — Ya sabes qué necesitas cambiar. Ahora te enseñamos cómo empezar.';

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      void trackAnalyticsEvent('share_click', 'copy_link', locale);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Te cuento tu primer paso',
          text: shareText,
          url: shareUrl,
        });
        void trackAnalyticsEvent('share_click', 'native_share', locale);
      } catch {
        // User canceled native share sheet
      }
    } else {
      void handleCopyShareLink();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setConsent(false);
    setErrorMessage(null);
  };

  return (
    <section
      id="registro"
      className="py-16 sm:py-24 bg-white dark:bg-[#171E31] border-t border-[#E2E8F2] dark:border-[#242E49]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
            {t.leadForm.kicker}
          </p>
          <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
            {t.leadForm.title}
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
            {t.leadForm.subtitle}
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-[#F4F6FA] dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 sm:p-9">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[#17A96D]/15 text-[#17A96D] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
                {t.leadForm.successTitle}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#4E5973] dark:text-[#A9B4CC] max-w-md mx-auto leading-relaxed">
                {t.leadForm.successBody}
              </p>

              <p className="mt-4 text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                Área elegida:{' '}
                <strong className="font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                  {getInterestLabel(interestArea, locale)}
                </strong>
              </p>

              {/* Social sharing block */}
              <div className="mt-8 pt-6 border-t border-[#E2E8F2] dark:border-[#2B3654]">
                <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4] mb-4">
                  {t.leadForm.sharePrompt}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#222B45] border border-[#DCE3F0] dark:border-[#324063] px-4 py-2.5 text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] hover:border-[#2270E2] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.leadForm.shareNative}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#222B45] border border-[#DCE3F0] dark:border-[#324063] px-4 py-2.5 text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] hover:border-[#2270E2] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#17A96D]" aria-hidden="true" />
                        <span>{t.leadForm.copiedLink}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.leadForm.copyLink}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void trackAnalyticsEvent('share_click', 'whatsapp', locale)}
                    className="inline-flex items-center rounded-xl bg-white dark:bg-[#222B45] border border-[#DCE3F0] dark:border-[#324063] px-4 py-2.5 text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] hover:border-[#17A96D] transition-colors"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void trackAnalyticsEvent('share_click', 'x', locale)}
                    className="inline-flex items-center rounded-xl bg-white dark:bg-[#222B45] border border-[#DCE3F0] dark:border-[#324063] px-4 py-2.5 text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] hover:border-[#2270E2] transition-colors"
                  >
                    X
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 text-xs font-medium text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#2270E2] dark:hover:text-[#63A0FA] underline underline-offset-4 cursor-pointer"
                >
                  {t.leadForm.registerAnother}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {selectedArea && (
                <div className="rounded-2xl bg-white dark:bg-[#141A2C] border border-[#DCE3F0] dark:border-[#2B3654] px-4 py-3 text-xs sm:text-sm text-[#4E5973] dark:text-[#A9B4CC] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {t.leadForm.selectedBanner}{' '}
                    <strong className="font-semibold text-[#1A2035] dark:text-[#F4F6FA]">
                      {getInterestLabel(interestArea, locale)}
                    </strong>
                  </span>
                </div>
              )}

              {/* Anti-spam honeypot field hidden from human users */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="lead-website">Website</label>
                <input
                  id="lead-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-sm font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-2"
                  >
                    {t.leadForm.nameLabel}
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    minLength={VALIDATION_LIMITS.LEAD_NAME_MIN}
                    maxLength={VALIDATION_LIMITS.LEAD_NAME_MAX}
                    autoComplete="given-name"
                    placeholder={t.leadForm.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-3 text-sm text-[#1A2035] dark:text-[#F4F6FA] placeholder:text-[#8692AC] focus:border-[#2270E2] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-sm font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-2"
                  >
                    {t.leadForm.emailLabel}
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    maxLength={VALIDATION_LIMITS.LEAD_EMAIL_MAX}
                    autoComplete="email"
                    placeholder={t.leadForm.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-3 text-sm text-[#1A2035] dark:text-[#F4F6FA] placeholder:text-[#8692AC] focus:border-[#2270E2] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-area"
                  className="block text-sm font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-2"
                >
                  {t.leadForm.areaLabel}
                </label>
                <select
                  id="lead-area"
                  value={interestArea}
                  onChange={(e) => {
                    const next = e.target.value as InterestAreaId;
                    setInterestArea(next);
                    onChangeArea(next);
                  }}
                  className="w-full rounded-xl bg-white dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-3 text-sm text-[#1A2035] dark:text-[#F4F6FA] focus:border-[#2270E2] focus:outline-none transition-colors"
                >
                  {INTEREST_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label[locale]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#C2CEE2] text-[#2270E2] focus:ring-[#2270E2] shrink-0"
                  />
                  <span className="text-xs sm:text-sm leading-relaxed text-[#4E5973] dark:text-[#A9B4CC]">
                    {t.leadForm.consentText}
                  </span>
                </label>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl bg-[#F44356]/10 border border-[#F44356]/30 px-4 py-3 text-xs sm:text-sm text-[#C82338] dark:text-[#FF8593]"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-60 text-white text-[15px] font-semibold px-6 py-3.5 transition-colors cursor-pointer"
              >
                {submitting ? t.leadForm.submitting : t.leadForm.submitButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
