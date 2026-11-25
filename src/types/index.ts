export type Locale = 'es' | 'en';
export type ThemePreference = 'system' | 'light' | 'dark';

export type CharacterId = 'nico' | 'bruno' | 'tito' | 'mateo' | 'aurelio';

export type InterestAreaId =
  | 'procrastination'
  | 'self_esteem'
  | 'emotions'
  | 'relationships'
  | 'habits'
  | 'direction'
  | 'unsure';

export type LeadSource = 'hero' | 'topic_card' | 'direct';

export type AnalyticsEventType =
  | 'page_view'
  | 'cta_click'
  | 'topic_select'
  | 'audio_play'
  | 'lead_submit'
  | 'share_click';

export interface AudioSample {
  id: string;
  title: string;
  description: string;
  character: CharacterId;
  durationLabel: string;
  audioUrl: string;
  active: boolean;
}

export interface SiteContentConfig {
  heroTitle: string;
  heroSubtitle: string;
  launchNote: string;
  philosophyQuote: string;
  audioSamples: AudioSample[];
  updatedAt?: Date | null;
  updatedBy?: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  interestArea: InterestAreaId;
  consent: boolean;
  locale: Locale;
  source: LeadSource;
  createdAt: Date | null;
}

export interface AnalyticsEventRecord {
  id: string;
  eventType: AnalyticsEventType;
  target: string;
  locale: Locale;
  createdAt: Date | null;
}

// Validation boundaries strictly synchronized with firebase-blueprint.json & firestore.rules
export const VALIDATION_LIMITS = {
  LEAD_NAME_MIN: 2,
  LEAD_NAME_MAX: 100,
  LEAD_EMAIL_MIN: 5,
  LEAD_EMAIL_MAX: 160,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  HERO_TITLE_MIN: 10,
  HERO_TITLE_MAX: 180,
  HERO_SUBTITLE_MIN: 10,
  HERO_SUBTITLE_MAX: 320,
  LAUNCH_NOTE_MAX: 160,
  PHILOSOPHY_MIN: 10,
  PHILOSOPHY_MAX: 220,
  MAX_AUDIO_SAMPLES: 10,
  AUDIO_TITLE_MIN: 2,
  AUDIO_TITLE_MAX: 120,
  AUDIO_DESC_MAX: 260,
  AUDIO_URL_MAX: 500,
  ANALYTICS_TARGET_MAX: 64,
} as const;
