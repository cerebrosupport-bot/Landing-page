import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IdentificationSection } from './components/IdentificationSection';
import { ProposalAndStepsSection } from './components/ProposalAndStepsSection';
import { PlatformPreviewSection } from './components/PlatformPreviewSection';
import { AudioExperienceSection } from './components/AudioExperienceSection';
import { PhilosophyAndFaqSection } from './components/PhilosophyAndFaqSection';
import { LeadCaptureSection } from './components/LeadCaptureSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { DEFAULT_SITE_CONTENT } from './data/content';
import { fetchLandingContent, trackAnalyticsEvent } from './firebase';
import type { InterestAreaId, LeadSource, SiteContentConfig } from './types';

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.pathname.startsWith('/admin') ||
    window.location.hash === '#admin'
  );
}

function AppShell() {
  const { locale } = useLocale();
  const [adminView, setAdminView] = useState<boolean>(isAdminRoute);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(DEFAULT_SITE_CONTENT);
  const [selectedArea, setSelectedArea] = useState<InterestAreaId | ''>('');
  const [leadSource, setLeadSource] = useState<LeadSource>('direct');

  // Sync browser back/forward navigation
  useEffect(() => {
    const onNav = () => setAdminView(isAdminRoute());
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);
    return () => {
      window.removeEventListener('popstate', onNav);
      window.removeEventListener('hashchange', onNav);
    };
  }, []);

  // Load editable landing content from Firestore (falls back smoothly to defaults)
  useEffect(() => {
    let active = true;
    void fetchLandingContent().then((loaded) => {
      if (active) setSiteContent(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  // Record one privacy-respecting anonymous page view per browser session
  useEffect(() => {
    if (adminView) return;
    try {
      const key = 'tctpp_pv_logged';
      if (!window.sessionStorage.getItem(key)) {
        window.sessionStorage.setItem(key, '1');
        void trackAnalyticsEvent('page_view', 'landing', locale);
      }
    } catch {
      // Ignore storage restrictions
    }
  }, [adminView, locale]);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setAdminView(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateToLanding = () => {
    window.history.pushState({}, '', '/');
    setAdminView(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToForm = (source: LeadSource, targetTag: string) => {
    setLeadSource(source);
    void trackAnalyticsEvent('cta_click', targetTag, locale);
    const el = document.getElementById('registro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectTopic = (area: InterestAreaId) => {
    setSelectedArea(area);
    setLeadSource('topic_card');
    void trackAnalyticsEvent('topic_select', area, locale);
    const el = document.getElementById('registro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (adminView) {
    return (
      <AdminPanel
        currentContent={siteContent}
        onContentSaved={(next) => setSiteContent(next)}
        onBackToLanding={navigateToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] dark:bg-[#121726] text-[#1A2035] dark:text-[#F4F6FA]">
      <Header onPrimaryCtaClick={() => scrollToForm('hero', 'header_cta')} />

      <main className="flex-1">
        <HeroSection
          content={siteContent}
          onPrimaryCta={() => scrollToForm('hero', 'hero_cta')}
        />

        <IdentificationSection
          selectedArea={selectedArea}
          onSelectArea={handleSelectTopic}
        />

        <ProposalAndStepsSection />

        <PlatformPreviewSection />

        <AudioExperienceSection
          samples={siteContent.audioSamples}
          onTrackPlay={(trackId) => void trackAnalyticsEvent('audio_play', trackId, locale)}
        />

        <PhilosophyAndFaqSection
          philosophyQuote={siteContent.philosophyQuote}
          onCtaClick={() => scrollToForm('direct', 'philosophy_cta')}
        />

        <LeadCaptureSection
          selectedArea={selectedArea}
          source={leadSource}
          onChangeArea={(area) => setSelectedArea(area)}
        />
      </main>

      <Footer onOpenAdmin={navigateToAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
