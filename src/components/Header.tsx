import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onPrimaryCtaClick: () => void;
}

export function Header({ onPrimaryCtaClick }: HeaderProps) {
  const { t } = useLocale();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#inicio', label: t.nav.home },
    { href: '#como-funciona', label: t.nav.howItWorks },
    { href: '#que-trabajar', label: t.nav.whatToWorkOn },
    { href: '#preguntas-frecuentes', label: t.nav.faq },
  ];

  const handleCta = () => {
    setMobileOpen(false);
    onPrimaryCtaClick();
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#F4F6FA]/90 dark:bg-[#121726]/90 backdrop-blur-md border-b border-[#E2E8F2] dark:border-[#242E49]">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand mark */}
        <a
          href="#inicio"
          className="focus-visible:outline-2 rounded-lg shrink-0"
          aria-label={t.brandName}
        >
          <BrandMark />
        </a>

        {/* Zone 2: Minimalist single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A556E] dark:text-[#A9B4CC]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 hover:text-[#1A2035] dark:hover:text-[#F4F6FA] transition-colors relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#2270E2] hover:after:w-full after:transition-all after:duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary CTA (desktop) + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCta}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white text-sm font-semibold px-4 py-2.5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.cta}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] text-[#1A2035] dark:text-[#F4F6FA] hover:bg-white dark:hover:bg-[#1A2035] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="lg:hidden bg-white dark:bg-[#1A2035] border-b border-[#E2E8F2] dark:border-[#2B3654] px-4 pt-3 pb-5 shadow-lg"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-xl text-[15px] font-medium text-[#1A2035] dark:text-[#F4F6FA] hover:bg-[#F4F6FA] dark:hover:bg-[#222B45] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-[#E2E8F2] dark:border-[#2B3654] flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCta}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white text-sm font-semibold px-4 py-3 transition-colors cursor-pointer"
            >
              {t.nav.cta}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full inline-flex items-center justify-center rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] text-sm font-medium text-[#4A556E] dark:text-[#A9B4CC] px-4 py-2.5 cursor-pointer"
            >
              {resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
