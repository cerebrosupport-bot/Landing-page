import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { DEFAULT_SITE_CONTENT } from './data/content';
import {
  VALIDATION_LIMITS,
  type AnalyticsEventRecord,
  type AnalyticsEventType,
  type InterestAreaId,
  type LeadRecord,
  type LeadSource,
  type Locale,
  type SiteContentConfig,
} from './types';

export const PRIMARY_ADMIN_EMAIL = 'cerebrosupport@gmail.com';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mandatory startup connectivity check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

function generateSafeId(prefix: string): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${randomPart}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function toDateOrNull(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

// Auth helpers
export async function loginAdminWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginAdminWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function sendAdminPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function logoutAdmin() {
  return signOut(auth);
}

export async function checkIsAuthorizedAdmin(uid: string, email: string | null, emailVerified: boolean): Promise<boolean> {
  if (!emailVerified) return false;
  if (email && email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const adminSnap = await getDoc(doc(db, 'admins', uid));
    return adminSnap.exists();
  } catch {
    return false;
  }
}

// Public Lead Submission (strictly synchronized with firebase-blueprint.json)
export async function submitLead(input: {
  name: string;
  email: string;
  interestArea: InterestAreaId;
  consent: boolean;
  locale: Locale;
  source: LeadSource;
}): Promise<string> {
  const cleanName = input.name.trim().slice(0, VALIDATION_LIMITS.LEAD_NAME_MAX);
  const cleanEmail = input.email.trim().toLowerCase().slice(0, VALIDATION_LIMITS.LEAD_EMAIL_MAX);

  if (cleanName.length < VALIDATION_LIMITS.LEAD_NAME_MIN) {
    throw new Error('Por favor ingresa un nombre válido.');
  }
  if (
    cleanEmail.length < VALIDATION_LIMITS.LEAD_EMAIL_MIN ||
    !VALIDATION_LIMITS.EMAIL_REGEX.test(cleanEmail)
  ) {
    throw new Error('Por favor ingresa un correo electrónico válido.');
  }
  if (!input.consent) {
    throw new Error('Necesitamos tu consentimiento para poder avisarte sobre el lanzamiento.');
  }

  const leadId = generateSafeId('lead');
  const docPath = `leads/${leadId}`;
  try {
    await setDoc(doc(db, 'leads', leadId), {
      name: cleanName,
      email: cleanEmail,
      interestArea: input.interestArea,
      consent: true,
      locale: input.locale,
      source: input.source,
      createdAt: serverTimestamp(),
    });
    return leadId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Privacy-friendly anonymous analytics event logger
export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  target = '',
  locale: Locale = 'es'
): Promise<void> {
  const safeTarget = target.trim().slice(0, VALIDATION_LIMITS.ANALYTICS_TARGET_MAX);
  const eventId = generateSafeId('evt');
  try {
    await setDoc(doc(db, 'analyticsEvents', eventId), {
      eventType,
      target: safeTarget,
      locale,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Non-blocking analytics should never disrupt the visitor's experience
  }
}

// Public read of landing content config
export async function fetchLandingContent(): Promise<SiteContentConfig> {
  const docPath = 'siteContent/landing';
  try {
    const snap = await getDoc(doc(db, 'siteContent', 'landing'));
    if (!snap.exists()) {
      return DEFAULT_SITE_CONTENT;
    }
    const data = snap.data();
    return {
      heroTitle: typeof data.heroTitle === 'string' ? data.heroTitle : DEFAULT_SITE_CONTENT.heroTitle,
      heroSubtitle:
        typeof data.heroSubtitle === 'string' ? data.heroSubtitle : DEFAULT_SITE_CONTENT.heroSubtitle,
      launchNote:
        typeof data.launchNote === 'string' ? data.launchNote : DEFAULT_SITE_CONTENT.launchNote,
      philosophyQuote:
        typeof data.philosophyQuote === 'string'
          ? data.philosophyQuote
          : DEFAULT_SITE_CONTENT.philosophyQuote,
      audioSamples: Array.isArray(data.audioSamples)
        ? data.audioSamples
        : DEFAULT_SITE_CONTENT.audioSamples,
      updatedAt: toDateOrNull(data.updatedAt),
      updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

// Admin save of landing content config
export async function saveLandingContent(content: SiteContentConfig): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Debes iniciar sesión como administrador para guardar cambios.');
  }

  const sanitizedAudios = content.audioSamples
    .slice(0, VALIDATION_LIMITS.MAX_AUDIO_SAMPLES)
    .map((item) => ({
      id: (item.id || generateSafeId('audio')).slice(0, 64),
      title: item.title.trim().slice(0, VALIDATION_LIMITS.AUDIO_TITLE_MAX),
      description: item.description.trim().slice(0, VALIDATION_LIMITS.AUDIO_DESC_MAX),
      character: item.character,
      durationLabel: (item.durationLabel.trim() || '0:24').slice(0, 16),
      audioUrl: item.audioUrl.trim().slice(0, VALIDATION_LIMITS.AUDIO_URL_MAX),
      active: Boolean(item.active),
    }));

  const payload = {
    heroTitle: content.heroTitle.trim().slice(0, VALIDATION_LIMITS.HERO_TITLE_MAX),
    heroSubtitle: content.heroSubtitle.trim().slice(0, VALIDATION_LIMITS.HERO_SUBTITLE_MAX),
    launchNote: content.launchNote.trim().slice(0, VALIDATION_LIMITS.LAUNCH_NOTE_MAX),
    philosophyQuote: content.philosophyQuote.trim().slice(0, VALIDATION_LIMITS.PHILOSOPHY_MAX),
    audioSamples: sanitizedAudios,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  };

  const docPath = 'siteContent/landing';
  try {
    await setDoc(doc(db, 'siteContent', 'landing'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// Admin live subscriptions
export function subscribeToLeads(
  onData: (leads: LeadRecord[]) => void,
  onError: (err: Error) => void
) {
  const path = 'leads';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(500));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: LeadRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ''),
          email: String(data.email ?? ''),
          interestArea: (data.interestArea ?? 'unsure') as InterestAreaId,
          consent: Boolean(data.consent),
          locale: (data.locale === 'en' ? 'en' : 'es') as Locale,
          source: (data.source ?? 'direct') as LeadSource,
          createdAt: toDateOrNull(data.createdAt),
        };
      });
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function deleteLeadRecord(leadId: string): Promise<void> {
  const docPath = `leads/${leadId}`;
  try {
    await deleteDoc(doc(db, 'leads', leadId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export function subscribeToAnalytics(
  onData: (events: AnalyticsEventRecord[]) => void,
  onError: (err: Error) => void
) {
  const path = 'analyticsEvents';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(1000));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: AnalyticsEventRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          eventType: (data.eventType ?? 'page_view') as AnalyticsEventType,
          target: String(data.target ?? ''),
          locale: (data.locale === 'en' ? 'en' : 'es') as Locale,
          createdAt: toDateOrNull(data.createdAt),
        };
      });
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

// Firebase Storage upload for official audio & visual assets
export async function uploadMediaAsset(
  file: File,
  folder: 'audio' | 'images' | 'logos'
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const storagePath = `public/${folder}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || undefined,
  });
  return getDownloadURL(snapshot.ref);
}
