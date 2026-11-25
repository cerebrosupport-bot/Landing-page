import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileAudio,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import { useAuth } from '../context/AuthContext';
import {
  CHARACTERS,
  DEFAULT_SITE_CONTENT,
  getInterestLabel,
  INTEREST_TOPICS,
} from '../data/content';
import {
  deleteLeadRecord,
  PRIMARY_ADMIN_EMAIL,
  saveLandingContent,
  subscribeToAnalytics,
  subscribeToLeads,
  uploadMediaAsset,
} from '../firebase';
import {
  VALIDATION_LIMITS,
  type AnalyticsEventRecord,
  type AudioSample,
  type CharacterId,
  type InterestAreaId,
  type LeadRecord,
  type SiteContentConfig,
} from '../types';

interface AdminPanelProps {
  currentContent: SiteContentConfig;
  onContentSaved: (next: SiteContentConfig) => void;
  onBackToLanding: () => void;
}

type AdminSection = 'leads' | 'content' | 'analytics';
type LoginTab = 'google' | 'email' | 'reset';

function formatDateTime(date: Date | null): string {
  if (!date) return 'Reciente';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function AdminPanel({
  currentContent,
  onContentSaved,
  onBackToLanding,
}: AdminPanelProps) {
  const {
    user,
    authReady,
    isAdmin,
    checkingAdmin,
    signInWithGoogle,
    signInWithEmail,
    resetPassword,
    logout,
  } = useAuth();

  const [section, setSection] = useState<AdminSection>('leads');
  const [loginTab, setLoginTab] = useState<LoginTab>('google');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  // Live admin data
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<InterestAreaId | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [analytics, setAnalytics] = useState<AnalyticsEventRecord[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Content editor state
  const [draftContent, setDraftContent] = useState<SiteContentConfig>(currentContent);
  const [savingContent, setSavingContent] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingAudioIdx, setUploadingAudioIdx] = useState<number | null>(null);

  useEffect(() => {
    setDraftContent(currentContent);
  }, [currentContent]);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) return;

    setLeadsLoading(true);
    setLeadsError(null);
    const unsubLeads = subscribeToLeads(
      (rows) => {
        setLeads(rows);
        setLeadsLoading(false);
      },
      (err) => {
        setLeadsError(err.message);
        setLeadsLoading(false);
      }
    );

    setAnalyticsLoading(true);
    const unsubAnalytics = subscribeToAnalytics(
      (events) => {
        setAnalytics(events);
        setAnalyticsLoading(false);
      },
      () => {
        setAnalyticsLoading(false);
      }
    );

    return () => {
      unsubLeads();
      unsubAnalytics();
    };
  }, [authReady, user, isAdmin]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (areaFilter !== 'all' && lead.interestArea !== areaFilter) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        getInterestLabel(lead.interestArea, 'es').toLowerCase().includes(q)
      );
    });
  }, [leads, searchQuery, areaFilter]);

  const interestBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const topic of INTEREST_TOPICS) {
      counts[topic.id] = 0;
    }
    for (const lead of leads) {
      counts[lead.interestArea] = (counts[lead.interestArea] || 0) + 1;
    }
    return INTEREST_TOPICS.map((topic) => ({
      ...topic,
      count: counts[topic.id] || 0,
      pct: leads.length > 0 ? Math.round(((counts[topic.id] || 0) / leads.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);
  }, [leads]);

  const recent7DaysCount = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return leads.filter((l) => l.createdAt && l.createdAt.getTime() >= cutoff).length;
  }, [leads]);

  const analyticsSummary = useMemo(() => {
    const counts = {
      page_view: 0,
      cta_click: 0,
      topic_select: 0,
      audio_play: 0,
      lead_submit: 0,
      share_click: 0,
    };
    for (const evt of analytics) {
      if (evt.eventType in counts) {
        counts[evt.eventType] += 1;
      }
    }
    const conversionRate =
      counts.page_view > 0
        ? ((counts.lead_submit / counts.page_view) * 100).toFixed(1)
        : '0.0';
    return { ...counts, conversionRate };
  }, [analytics]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthNotice(null);
    setAuthBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No fue posible iniciar sesión con Google.';
      setAuthError(msg);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    setAuthBusy(true);
    try {
      await signInWithEmail(emailInput, passwordInput);
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      if (raw.includes('operation-not-allowed')) {
        setAuthError(
          'El proveedor de correo/contraseña aún no está habilitado en tu Firebase Console. Puedes entrar ahora mismo con Google o activar Email/Password en Authentication > Sign-in method.'
        );
      } else {
        setAuthError('Credenciales inválidas o cuenta no autorizada.');
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    if (!emailInput.trim()) {
      setAuthError('Ingresa tu correo administrativo para enviar el enlace de recuperación.');
      return;
    }
    setAuthBusy(true);
    try {
      await resetPassword(emailInput);
      setAuthNotice('Si la cuenta existe, enviamos un correo para restablecer la contraseña.');
    } catch {
      setAuthError('No pudimos enviar el correo de recuperación en este momento.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleExportCsv = () => {
    const header = ['Nombre', 'Correo electrónico', 'Área de interés', 'Consentimiento', 'Origen', 'Idioma', 'Fecha'];
    const escapeCell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      getInterestLabel(lead.interestArea, 'es'),
      lead.consent ? 'Sí' : 'No',
      lead.source,
      lead.locale,
      lead.createdAt ? lead.createdAt.toISOString() : '',
    ]);
    const csv =
      '\uFEFF' + [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registros-te-cuento-tu-primer-paso-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLeadRecord(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      setConfirmDeleteId(null);
    } catch {
      setLeadsError('No se pudo eliminar el registro seleccionado.');
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    if (draftContent.heroTitle.trim().length < VALIDATION_LIMITS.HERO_TITLE_MIN) {
      setSaveError('El titular principal debe tener al menos 10 caracteres.');
      return;
    }
    if (draftContent.heroSubtitle.trim().length < VALIDATION_LIMITS.HERO_SUBTITLE_MIN) {
      setSaveError('El texto secundario debe tener al menos 10 caracteres.');
      return;
    }

    setSavingContent(true);
    try {
      await saveLandingContent(draftContent);
      onContentSaved(draftContent);
      setSaveMessage('Contenidos y audios guardados correctamente en Firestore.');
    } catch {
      setSaveError('No se pudieron guardar los cambios. Verifica tu sesión de administrador.');
    } finally {
      setSavingContent(false);
    }
  };

  const updateAudioSample = (index: number, patch: Partial<AudioSample>) => {
    setDraftContent((prev) => {
      const next = [...prev.audioSamples];
      next[index] = { ...next[index], ...patch };
      return { ...prev, audioSamples: next };
    });
  };

  const addAudioSample = () => {
    if (draftContent.audioSamples.length >= VALIDATION_LIMITS.MAX_AUDIO_SAMPLES) return;
    setDraftContent((prev) => ({
      ...prev,
      audioSamples: [
        ...prev.audioSamples,
        {
          id: `audio_${Date.now().toString(36)}`,
          title: 'Nueva muestra de audio',
          description: 'Descripción breve de esta pista demostrativa.',
          character: 'mateo',
          durationLabel: '0:24',
          audioUrl: '/audio/primer-paso-calma.wav',
          active: true,
        },
      ],
    }));
  };

  const removeAudioSample = (index: number) => {
    setDraftContent((prev) => ({
      ...prev,
      audioSamples: prev.audioSamples.filter((_, idx) => idx !== index),
    }));
  };

  const handleAudioFileUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingAudioIdx(index);
    setSaveError(null);
    try {
      const url = await uploadMediaAsset(file, 'audio');
      updateAudioSample(index, { audioUrl: url });
      setSaveMessage('Archivo de audio subido a Firebase Storage. Recuerda guardar los cambios.');
    } catch {
      setSaveError(
        'No se pudo subir el archivo a Firebase Storage (verifica las reglas de Storage en tu consola Firebase) o pega una URL directa de audio.'
      );
    } finally {
      setUploadingAudioIdx(null);
    }
  };

  // Loading auth state
  if (!authReady || checkingAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#121726] flex items-center justify-center p-6">
        <div className="text-sm text-[#525E7A] dark:text-[#9BA8C4]">
          Verificando acceso administrativo...
        </div>
      </div>
    );
  }

  // Unauthenticated admin login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#121726] flex flex-col justify-between p-6">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#1A2035] dark:hover:text-[#F4F6FA] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la landing</span>
          </button>
        </div>

        <main className="max-w-md w-full mx-auto my-12 rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-7 sm:p-8">
          <p className="text-xs font-semibold text-[#2270E2] dark:text-[#63A0FA]">
            Panel administrativo privado
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
            Acceso autorizado
          </h1>
          <p className="mt-2 text-sm text-[#525E7A] dark:text-[#9BA8C4]">
            Inicia sesión para consultar registros de interés, métricas agregadas y gestionar los
            audios y contenidos de la landing.
          </p>

          {/* Auth mode tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#E2E8F2] dark:border-[#2B3654]">
            <button
              type="button"
              onClick={() => {
                setLoginTab('google');
                setAuthError(null);
                setAuthNotice(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                loginTab === 'google'
                  ? 'bg-white dark:bg-[#1A2035] text-[#1A2035] dark:text-[#F4F6FA]'
                  : 'text-[#525E7A] dark:text-[#9BA8C4]'
              }`}
            >
              Cuenta Google
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginTab('email');
                setAuthError(null);
                setAuthNotice(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                loginTab === 'email' || loginTab === 'reset'
                  ? 'bg-white dark:bg-[#1A2035] text-[#1A2035] dark:text-[#F4F6FA]'
                  : 'text-[#525E7A] dark:text-[#9BA8C4]'
              }`}
            >
              Correo y contraseña
            </button>
          </div>

          {loginTab === 'google' && (
            <div className="mt-6 space-y-4">
              <button
                type="button"
                disabled={authBusy}
                onClick={handleGoogleSignIn}
                className="w-full rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-60 text-white text-sm font-semibold px-5 py-3.5 transition-colors cursor-pointer"
              >
                {authBusy ? 'Conectando...' : 'Continuar con Google'}
              </button>
              <p className="text-xs text-[#697592] dark:text-[#8492B2] leading-relaxed">
                Solo las cuentas administradoras autorizadas (por ejemplo {PRIMARY_ADMIN_EMAIL})
                pueden ver registros o editar contenidos.
              </p>
            </div>
          )}

          {loginTab === 'email' && (
            <form onSubmit={handleEmailSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2.5 text-sm text-[#1A2035] dark:text-[#F4F6FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2.5 text-sm text-[#1A2035] dark:text-[#F4F6FA]"
                />
              </div>
              <button
                type="submit"
                disabled={authBusy}
                className="w-full rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-60 text-white text-sm font-semibold px-5 py-3 transition-colors cursor-pointer"
              >
                {authBusy ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginTab('reset');
                  setAuthError(null);
                  setAuthNotice(null);
                }}
                className="w-full text-center text-xs font-medium text-[#2270E2] dark:text-[#63A0FA] hover:underline cursor-pointer"
              >
                Recuperar contraseña
              </button>
            </form>
          )}

          {loginTab === 'reset' && (
            <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2035] dark:text-[#F4F6FA] mb-1.5">
                  Correo administrativo
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2.5 text-sm text-[#1A2035] dark:text-[#F4F6FA]"
                />
              </div>
              <button
                type="submit"
                disabled={authBusy}
                className="w-full rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-60 text-white text-sm font-semibold px-5 py-3 transition-colors cursor-pointer"
              >
                Enviar enlace de recuperación
              </button>
              <button
                type="button"
                onClick={() => setLoginTab('email')}
                className="w-full text-center text-xs text-[#525E7A] dark:text-[#9BA8C4] hover:underline cursor-pointer"
              >
                Volver al inicio de sesión
              </button>
            </form>
          )}

          {authError && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-[#F44356]/10 border border-[#F44356]/30 px-3.5 py-2.5 text-xs text-[#C82338] dark:text-[#FF8593]"
            >
              {authError}
            </p>
          )}
          {authNotice && (
            <p className="mt-4 rounded-xl bg-[#17A96D]/10 border border-[#17A96D]/30 px-3.5 py-2.5 text-xs text-[#117A4F] dark:text-[#5BE0A8]">
              {authNotice}
            </p>
          )}
        </main>

        <div className="text-center text-xs text-[#697592] dark:text-[#8492B2]">
          Te cuento el porqué · Acceso restringido
        </div>
      </div>
    );
  }

  // Signed in but NOT an authorized admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#121726] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-8 text-center">
          <h1 className="text-xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
            Cuenta sin permisos de administración
          </h1>
          <p className="mt-3 text-sm text-[#525E7A] dark:text-[#9BA8C4]">
            Has iniciado sesión como <strong>{user.email}</strong>, pero esta cuenta no tiene
            acceso al panel privado de Te cuento tu primer paso.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
            >
              Cerrar sesión
            </button>
            <button
              type="button"
              onClick={onBackToLanding}
              className="rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] text-sm font-semibold text-[#1A2035] dark:text-[#F4F6FA] px-5 py-2.5 cursor-pointer"
            >
              Volver a la landing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Dashboard
  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#121726] text-[#1A2035] dark:text-[#F4F6FA] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#1A2035] border-b lg:border-b-0 lg:border-r border-[#E2E8F2] dark:border-[#2B3654] p-5 flex flex-col justify-between">
        <div>
          <BrandMark />
          <p className="mt-2 text-xs text-[#525E7A] dark:text-[#9BA8C4]">
            Panel administrativo
          </p>

          <nav className="mt-6 flex lg:flex-col gap-1.5 overflow-x-auto" aria-label="Secciones del panel">
            {[
              { id: 'leads' as const, label: 'Registros', icon: <Users className="w-4 h-4" /> },
              {
                id: 'content' as const,
                label: 'Contenidos y audios',
                icon: <FileAudio className="w-4 h-4" />,
              },
              {
                id: 'analytics' as const,
                label: 'Métricas',
                icon: <BarChart3 className="w-4 h-4" />,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  section === item.id
                    ? 'bg-[#2270E2] text-white'
                    : 'text-[#4E5973] dark:text-[#A9B4CC] hover:bg-[#F4F6FA] dark:hover:bg-[#222B45]'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E2E8F2] dark:border-[#2B3654] space-y-3">
          <div className="text-xs text-[#525E7A] dark:text-[#9BA8C4] truncate">
            {user.email}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToLanding}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] px-3 py-2 text-xs font-semibold hover:bg-[#F4F6FA] dark:hover:bg-[#222B45] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver landing</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              aria-label="Cerrar sesión"
              className="inline-flex items-center justify-center rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] p-2 text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#F44356] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E8F2] dark:border-[#2B3654]">
          <div>
            <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">
              Te cuento tu primer paso / Administración
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {section === 'leads' && 'Personas registradas'}
              {section === 'content' && 'Contenidos y audios demostrativos'}
              {section === 'analytics' && 'Métricas de visitas y conversión'}
            </h1>
          </div>

          {section === 'leads' && (
            <button
              type="button"
              disabled={filteredLeads.length === 0}
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          )}
        </div>

        {/* SECTION 1: LEADS */}
        {section === 'leads' && (
          <div className="mt-6 space-y-6">
            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-5">
                <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">Total registradas</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{leads.length}</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-5">
                <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">Últimos 7 días</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{recent7DaysCount}</p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-5">
                <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">Área de mayor interés</p>
                <p className="mt-2 text-base font-bold truncate">
                  {leads.length > 0 ? interestBreakdown[0].label.es : 'Sin registros aún'}
                </p>
              </div>
            </div>

            {/* Interest Area Distribution */}
            <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6">
              <h2 className="text-sm font-bold mb-4">Áreas de mayor interés</h2>
              <div className="space-y-3">
                {interestBreakdown.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{item.label.es}</span>
                      <span className="text-[#525E7A] dark:text-[#9BA8C4] tabular-nums">
                        {item.count} ({item.pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EEF2F7] dark:bg-[#242E49] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: item.accentColor === '#1A2035' ? '#64748B' : item.accentColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search + Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7A86A1] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  placeholder="Buscar por nombre o correo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white dark:bg-[#1A2035] border border-[#DCE3F0] dark:border-[#2B3654] pl-10 pr-4 py-2.5 text-sm"
                />
              </div>

              <select
                aria-label="Filtrar por área"
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as InterestAreaId | 'all')}
                className="rounded-xl bg-white dark:bg-[#1A2035] border border-[#DCE3F0] dark:border-[#2B3654] px-4 py-2.5 text-sm"
              >
                <option value="all">Todas las áreas</option>
                {INTEREST_TOPICS.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label.es}
                  </option>
                ))}
              </select>
            </div>

            {leadsError && (
              <p className="rounded-xl bg-[#F44356]/10 border border-[#F44356]/30 px-4 py-3 text-xs text-[#C82338] dark:text-[#FF8593]">
                Error al cargar registros: {leadsError}
              </p>
            )}

            {/* Leads Table */}
            <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] overflow-hidden">
              {leadsLoading ? (
                <div className="p-8 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-10 rounded-lg bg-[#EEF2F7] dark:bg-[#222B45] animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-10 text-center text-sm text-[#525E7A] dark:text-[#9BA8C4]">
                  No hay registros que coincidan con tu búsqueda todavía.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F2] dark:border-[#2B3654] text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                        <th className="py-3.5 px-4 font-semibold">Nombre</th>
                        <th className="py-3.5 px-4 font-semibold">Correo</th>
                        <th className="py-3.5 px-4 font-semibold">Área de interés</th>
                        <th className="py-3.5 px-4 font-semibold">Fecha</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF2F7] dark:divide-[#242E49]">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-[#F8FAFD] dark:hover:bg-[#1F2740] transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4 font-medium">{lead.name}</td>
                          <td className="py-3 px-4 text-[#4E5973] dark:text-[#A9B4CC]">
                            {lead.email}
                          </td>
                          <td className="py-3 px-4">
                            {getInterestLabel(lead.interestArea, 'es')}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#525E7A] dark:text-[#9BA8C4] tabular-nums whitespace-nowrap">
                            {formatDateTime(lead.createdAt)}
                          </td>
                          <td
                            className="py-3 px-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {confirmDeleteId === lead.id ? (
                              <span className="inline-flex items-center gap-2 text-xs">
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteLead(lead.id)}
                                  className="text-[#F44356] font-semibold hover:underline cursor-pointer"
                                >
                                  Confirmar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-[#525E7A] hover:underline cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(lead.id)}
                                aria-label={`Eliminar registro de ${lead.name}`}
                                className="p-1.5 rounded-lg text-[#697592] hover:text-[#F44356] cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Individual Lead Detail Card */}
            {selectedLead && (
              <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#2270E2]/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#2270E2] dark:text-[#63A0FA] font-semibold">
                      Detalle del registro
                    </p>
                    <h3 className="mt-1 text-lg font-bold">{selectedLead.name}</h3>
                    <p className="text-sm text-[#525E7A] dark:text-[#9BA8C4]">
                      {selectedLead.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="text-xs text-[#525E7A] hover:underline cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
                <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EEF2F7] dark:border-[#242E49] text-xs">
                  <div>
                    <dt className="text-[#525E7A] dark:text-[#9BA8C4]">Área elegida</dt>
                    <dd className="mt-1 font-semibold">
                      {getInterestLabel(selectedLead.interestArea, 'es')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#525E7A] dark:text-[#9BA8C4]">Consentimiento</dt>
                    <dd className="mt-1 font-semibold">
                      {selectedLead.consent ? 'Confirmado' : 'No'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#525E7A] dark:text-[#9BA8C4]">Origen</dt>
                    <dd className="mt-1 font-semibold">{selectedLead.source}</dd>
                  </div>
                  <div>
                    <dt className="text-[#525E7A] dark:text-[#9BA8C4]">Fecha</dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {formatDateTime(selectedLead.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: CONTENT & AUDIO MANAGER */}
        {section === 'content' && (
          <form onSubmit={handleSaveContent} className="mt-6 space-y-6">
            <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-bold">Textos principales de la landing</h2>
                <button
                  type="button"
                  onClick={() => setDraftContent(DEFAULT_SITE_CONTENT)}
                  className="text-xs font-medium text-[#525E7A] dark:text-[#9BA8C4] hover:text-[#2270E2] cursor-pointer"
                >
                  Restaurar valores por defecto
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Título Hero ({draftContent.heroTitle.length}/{VALIDATION_LIMITS.HERO_TITLE_MAX})
                </label>
                <input
                  type="text"
                  maxLength={VALIDATION_LIMITS.HERO_TITLE_MAX}
                  value={draftContent.heroTitle}
                  onChange={(e) =>
                    setDraftContent((p) => ({ ...p, heroTitle: e.target.value }))
                  }
                  className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Subtítulo Hero ({draftContent.heroSubtitle.length}/
                  {VALIDATION_LIMITS.HERO_SUBTITLE_MAX})
                </label>
                <textarea
                  rows={2}
                  maxLength={VALIDATION_LIMITS.HERO_SUBTITLE_MAX}
                  value={draftContent.heroSubtitle}
                  onChange={(e) =>
                    setDraftContent((p) => ({ ...p, heroSubtitle: e.target.value }))
                  }
                  className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Nota superior de lanzamiento
                  </label>
                  <input
                    type="text"
                    maxLength={VALIDATION_LIMITS.LAUNCH_NOTE_MAX}
                    value={draftContent.launchNote}
                    onChange={(e) =>
                      setDraftContent((p) => ({ ...p, launchNote: e.target.value }))
                    }
                    className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Mensaje de filosofía
                  </label>
                  <input
                    type="text"
                    maxLength={VALIDATION_LIMITS.PHILOSOPHY_MAX}
                    value={draftContent.philosophyQuote}
                    onChange={(e) =>
                      setDraftContent((p) => ({ ...p, philosophyQuote: e.target.value }))
                    }
                    className="w-full rounded-xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#D4DDEC] dark:border-[#2E3A5A] px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Audio Samples Manager */}
            <div className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold">Muestras de audio demostrativas</h2>
                  <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4] mt-0.5">
                    Sube archivos MP3/WAV a Firebase Storage o edita la URL directa de cada pista
                    (máximo {VALIDATION_LIMITS.MAX_AUDIO_SAMPLES}).
                  </p>
                </div>
                <button
                  type="button"
                  disabled={draftContent.audioSamples.length >= VALIDATION_LIMITS.MAX_AUDIO_SAMPLES}
                  onClick={addAudioSample}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] px-3.5 py-2 text-xs font-semibold hover:border-[#2270E2] disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir pista</span>
                </button>
              </div>

              <div className="space-y-4">
                {draftContent.audioSamples.map((track, idx) => (
                  <div
                    key={track.id}
                    className="rounded-2xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#E2E8F2] dark:border-[#2B3654] p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[#525E7A] dark:text-[#9BA8C4] tabular-nums">
                        Pista 0{idx + 1}
                      </span>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={track.active}
                            onChange={(e) =>
                              updateAudioSample(idx, { active: e.target.checked })
                            }
                          />
                          <span>Visible</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeAudioSample(idx)}
                          className="text-xs text-[#F44356] hover:underline cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Título del audio"
                        maxLength={VALIDATION_LIMITS.AUDIO_TITLE_MAX}
                        value={track.title}
                        onChange={(e) => updateAudioSample(idx, { title: e.target.value })}
                        className="sm:col-span-2 rounded-xl bg-white dark:bg-[#1A2035] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2 text-sm"
                      />
                      <select
                        value={track.character}
                        onChange={(e) =>
                          updateAudioSample(idx, { character: e.target.value as CharacterId })
                        }
                        className="rounded-xl bg-white dark:bg-[#1A2035] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2 text-sm"
                      >
                        {Object.values(CHARACTERS).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Descripción breve"
                      maxLength={VALIDATION_LIMITS.AUDIO_DESC_MAX}
                      value={track.description}
                      onChange={(e) => updateAudioSample(idx, { description: e.target.value })}
                      className="w-full rounded-xl bg-white dark:bg-[#1A2035] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2 text-sm"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <input
                        type="text"
                        placeholder="URL del audio (/audio/... o https://...)"
                        maxLength={VALIDATION_LIMITS.AUDIO_URL_MAX}
                        value={track.audioUrl}
                        onChange={(e) => updateAudioSample(idx, { audioUrl: e.target.value })}
                        className="sm:col-span-7 rounded-xl bg-white dark:bg-[#1A2035] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3.5 py-2 text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Duración (ej. 1:30)"
                        maxLength={16}
                        value={track.durationLabel}
                        onChange={(e) => updateAudioSample(idx, { durationLabel: e.target.value })}
                        className="sm:col-span-2 rounded-xl bg-white dark:bg-[#1A2035] border border-[#D4DDEC] dark:border-[#2E3A5A] px-3 py-2 text-xs tabular-nums"
                      />
                      <label className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] bg-white dark:bg-[#1A2035] px-3 py-2 text-xs font-semibold hover:border-[#2270E2] cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingAudioIdx === idx ? 'Subiendo...' : 'Subir audio'}
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) =>
                            void handleAudioFileUpload(idx, e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {saveError && (
              <p
                role="alert"
                className="rounded-xl bg-[#F44356]/10 border border-[#F44356]/30 px-4 py-3 text-xs text-[#C82338] dark:text-[#FF8593]"
              >
                {saveError}
              </p>
            )}
            {saveMessage && (
              <p className="rounded-xl bg-[#17A96D]/10 border border-[#17A96D]/30 px-4 py-3 text-xs text-[#117A4F] dark:text-[#5BE0A8]">
                {saveMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={savingContent}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2270E2] hover:bg-[#1B5EC0] disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingContent ? 'Guardando...' : 'Guardar cambios'}</span>
            </button>
          </form>
        )}

        {/* SECTION 3: PRIVACY-FRIENDLY ANALYTICS */}
        {section === 'analytics' && (
          <div className="mt-6 space-y-6">
            <p className="text-sm text-[#525E7A] dark:text-[#9BA8C4]">
              Medición agregada de visitas, clics y conversiones sin cookies de terceros ni
              rastreo individual de personas.
            </p>

            {analyticsLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-24 rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Visitas registradas', value: String(analyticsSummary.page_view) },
                  { label: 'Clics en CTA principal', value: String(analyticsSummary.cta_click) },
                  {
                    label: 'Selecciones de área',
                    value: String(analyticsSummary.topic_select),
                  },
                  {
                    label: 'Reproducciones de audio',
                    value: String(analyticsSummary.audio_play),
                  },
                  {
                    label: 'Formularios enviados',
                    value: String(analyticsSummary.lead_submit),
                  },
                  {
                    label: 'Conversión estimada',
                    value: `${analyticsSummary.conversionRate}%`,
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-5"
                  >
                    <p className="text-xs text-[#525E7A] dark:text-[#9BA8C4]">{metric.label}</p>
                    <p className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
